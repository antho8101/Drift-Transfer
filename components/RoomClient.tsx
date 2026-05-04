"use client";

import Image from "next/image";
import Link from "next/link";
import { createSHA256 } from "hash-wasm";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from "react";
import { createAblyClient, type DriftSignal } from "@/lib/ably";
import {
  acceptAnswer,
  addIceCandidate,
  createAnswer,
  createOffer,
  createPeerConnection,
  DATA_CHANNEL_NAME
} from "@/lib/webrtc";
import {
  type FileMetadata,
  parseControlMessage,
  sendFileOverDataChannel
} from "@/lib/fileTransfer";
import { DropZone } from "@/components/DropZone";
import { InviteQrCode } from "@/components/InviteQrCode";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { createVerificationCode, formatBytes, formatDuration } from "@/lib/utils";

type Role = "sender" | "receiver" | null;
type TransferState = "idle" | "sending" | "receiving" | "complete";

type RoomClientProps = {
  roomId: string;
};

type ReceivedFile = {
  url: string;
  name: string;
  type: string;
  size: number;
  checksum: string;
  verified: boolean;
};

type RecentTransfer = {
  name: string;
  size: number;
  direction: "sent" | "received";
  completedAt: string;
};

export function RoomClient({ roomId }: RoomClientProps) {
  const clientId = useMemo(() => crypto.randomUUID(), []);
  const origin = useSyncExternalStore(
    () => () => undefined,
    () => window.location.origin,
    () => ""
  );
  const [role, setRole] = useState<Role>(null);
  const [copied, setCopied] = useState(false);
  const [statusText, setStatusText] = useState("Preparing room...");
  const [statusTone, setStatusTone] =
    useState<"idle" | "waiting" | "connected" | "error" | "complete">("idle");
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [incomingMetadata, setIncomingMetadata] = useState<FileMetadata | null>(
    null
  );
  const [sentBytes, setSentBytes] = useState(0);
  const [receivedBytes, setReceivedBytes] = useState(0);
  const [transferState, setTransferState] = useState<TransferState>("idle");
  const [receivedFile, setReceivedFile] = useState<ReceivedFile | null>(null);
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const [recentTransfers, setRecentTransfers] = useState<RecentTransfer[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const storedHistory = localStorage.getItem("drift-transfer-history");
      return storedHistory ? (JSON.parse(storedHistory) as RecentTransfer[]) : [];
    } catch {
      return [];
    }
  });
  const [transferStartedAt, setTransferStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [channelOpen, setChannelOpen] = useState(false);
  const [roomFull, setRoomFull] = useState(false);

  const roleRef = useRef<Role>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const chunksRef = useRef<ArrayBuffer[]>([]);
  const metadataRef = useRef<FileMetadata | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const receivedFileUrlsRef = useRef<string[]>([]);
  const shareLink = origin ? `${origin}/room/${roomId}` : "";
  const verificationCode = createVerificationCode(roomId);

  const addRecentTransfer = useCallback((transfer: RecentTransfer) => {
    setRecentTransfers((history) => {
      const nextHistory = [transfer, ...history].slice(0, 6);

      try {
        localStorage.setItem("drift-transfer-history", JSON.stringify(nextHistory));
      } catch {
        // Local history is a convenience only; transfers should never depend on it.
      }

      return nextHistory;
    });
  }, []);

  const notifyTransferComplete = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate?.(80);
    }

    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.frequency.value = 660;
      gain.gain.value = 0.025;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.12);
    } catch {
      // Browsers may block audio without a recent user gesture.
    }
  }, []);

  const handleControlMessage = useCallback(async (payload: string) => {
    const message = parseControlMessage(payload);

    if (!message) {
      return;
    }

    if (message.kind === "metadata") {
      chunksRef.current = [];
      metadataRef.current = message;
      setIncomingMetadata(message);
      setReceivedBytes(0);
      setReceivedFile(null);
      const startedAt = Date.now();
      setTransferStartedAt(startedAt);
      setNow(startedAt);
      setTransferState("receiving");
      setStatusText("Receiving file...");
      setStatusTone("connected");
      return;
    }

    const metadata = metadataRef.current;

    if (message.kind === "complete" && metadata && message.fileId === metadata.fileId) {
      const blob = new Blob(chunksRef.current, { type: metadata.filetype });
      const url = URL.createObjectURL(blob);
      const hasher = await createSHA256();

      for (const chunk of chunksRef.current) {
        hasher.update(new Uint8Array(chunk));
      }

      const checksum = hasher.digest("hex");
      const verified = checksum === message.checksum;

      receivedFileUrlsRef.current.push(url);
      const nextReceivedFile = {
        url,
        name: metadata.filename,
        type: metadata.filetype,
        size: metadata.filesize,
        checksum,
        verified
      };

      setReceivedFile(nextReceivedFile);
      setReceivedFiles((files) => [...files, nextReceivedFile]);
      setReceivedBytes(metadata.filesize);
      setTransferState("complete");
      setStatusText(verified ? "Transfer complete" : "Transfer complete, checksum mismatch");
      setStatusTone("complete");
      addRecentTransfer({
        name: metadata.filename,
        size: metadata.filesize,
        direction: "received",
        completedAt: new Date().toISOString()
      });
      notifyTransferComplete();
    }
  }, [addRecentTransfer, notifyTransferComplete]);

  const wireDataChannel = useCallback(
    (channel: RTCDataChannel) => {
      channel.binaryType = "arraybuffer";
      dataChannelRef.current = channel;

      channel.onopen = () => {
        setChannelOpen(true);
        setStatusText("Secure device link established");
        setStatusTone("connected");
      };

      channel.onclose = () => {
        setChannelOpen(false);
      };

      channel.onerror = () => {
        setError("The file channel reported an error.");
        setStatusTone("error");
      };

      channel.onmessage = (event) => {
        if (typeof event.data === "string") {
          void handleControlMessage(event.data);
          return;
        }

        if (event.data instanceof ArrayBuffer) {
          chunksRef.current.push(event.data);
          setReceivedBytes((current) => current + event.data.byteLength);
        }
      };
    },
    [handleControlMessage]
  );

  useEffect(() => {
    let disposed = false;
    let offerSent = false;

    async function startRoom() {
      try {
        const ably = createAblyClient(clientId, roomId);
        const channel = ably.channels.get(`room:${roomId}`);

        const publishSignal = async (signal: DriftSignal) => {
          await channel.publish("signal", signal);
        };

        const flushIceCandidates = async () => {
          const peer = peerRef.current;

          if (!peer?.remoteDescription) {
            return;
          }

          const queued = [...pendingIceRef.current];
          pendingIceRef.current = [];

          for (const candidate of queued) {
            await addIceCandidate(peer, candidate);
          }
        };

        const makeOffer = async () => {
          const peer = peerRef.current;

          if (!peer || offerSent || roleRef.current !== "sender") {
            return;
          }

          offerSent = true;
          setStatusText("Connecting to the other device...");
          setStatusTone("waiting");

          // The data channel must exist before the offer so the receiver gets it
          // through the WebRTC negotiation.
          if (!dataChannelRef.current) {
            wireDataChannel(peer.createDataChannel(DATA_CHANNEL_NAME));
          }

          const offer = await createOffer(peer);
          await publishSignal({ type: "offer", from: clientId, sdp: offer });
        };

        const peer = createPeerConnection({
          onIceCandidate: (candidate) => {
            void publishSignal({
              type: "ice-candidate",
              from: clientId,
              candidate
            }).catch(() => setError("Could not publish an ICE candidate."));
          },
          onConnectionStateChange: (state) => {
            if (state === "connected") {
              setStatusText("Secure device link established");
              setStatusTone("connected");
            }

            if (state === "failed" || state === "disconnected") {
              setStatusText("Device link interrupted");
              setStatusTone("error");
            }
          },
          onDataChannel: wireDataChannel
        });

        peerRef.current = peer;

        channel.subscribe("signal", (message) => {
          void handleSignal(message.data as DriftSignal);
        });

        channel.presence.subscribe("enter", (member) => {
          if (member.clientId !== clientId && roleRef.current === "sender") {
            void makeOffer().catch(() => setError("Could not create offer."));
          }

          void channel.presence.get().then((presenceMembers) => {
            if (presenceMembers.length > 2 && roleRef.current) {
              setError("This room already has two devices. Ask extra visitors to close the tab.");
            }
          });
        });

        await channel.presence.enter({ joinedAt: Date.now() });
        const members = await channel.presence.get();
        const sortedMembers = members.sort((a, b) => {
          const aJoinedAt = Number(a.data?.joinedAt ?? 0);
          const bJoinedAt = Number(b.data?.joinedAt ?? 0);
          return aJoinedAt - bJoinedAt;
        });
        const currentMemberIndex = sortedMembers.findIndex(
          (member) => member.clientId === clientId
        );

        if (currentMemberIndex > 1) {
          setRoomFull(true);
          setStatusText("Room already has two devices");
          setStatusTone("error");
          setError("This transfer room is full. Start a fresh room to send files.");
          await channel.presence.leave();
          return () => {
            disposed = true;
            channel.unsubscribe();
            channel.presence.unsubscribe();
            dataChannelRef.current?.close();
            peer.close();
            ably.close();
          };
        }

        const firstClientId = sortedMembers[0]?.clientId;
        const nextRole: Role = firstClientId === clientId ? "sender" : "receiver";

        roleRef.current = nextRole;
        setRole(nextRole);

        if (nextRole === "sender") {
          setStatusText("Waiting for another device...");
          setStatusTone("waiting");

          if (sortedMembers.length > 1) {
            await makeOffer();
          }
        } else {
          setStatusText("Joining device link...");
          setStatusTone("waiting");
          await publishSignal({ type: "peer-ready", from: clientId });
        }

        async function handleSignal(signal: DriftSignal) {
          if (disposed || signal.from === clientId) {
            return;
          }

          if (signal.type === "peer-ready" && roleRef.current === "sender") {
            await makeOffer();
            return;
          }

          if (signal.type === "offer" && roleRef.current === "receiver") {
            setStatusText("Answering device link...");
            const answer = await createAnswer(peer, signal.sdp);
            await publishSignal({ type: "answer", from: clientId, sdp: answer });
            await flushIceCandidates();
            return;
          }

          if (signal.type === "answer" && roleRef.current === "sender") {
            await acceptAnswer(peer, signal.sdp);
            await flushIceCandidates();
            return;
          }

          if (signal.type === "ice-candidate") {
            if (peer.remoteDescription) {
              await addIceCandidate(peer, signal.candidate);
            } else {
              pendingIceRef.current.push(signal.candidate);
            }
          }
        }

        return () => {
          disposed = true;
          channel.unsubscribe();
          channel.presence.unsubscribe();
          void channel.presence.leave();
          dataChannelRef.current?.close();
          peer.close();
          ably.close();
        };
      } catch (roomError) {
        setStatusText("Room setup failed");
        setStatusTone("error");
        setError(
          roomError instanceof Error
            ? roomError.message
            : "Could not initialize the room."
        );
      }
    }

    let cleanup: (() => void) | undefined;
    void startRoom().then((cleanupRoom) => {
      cleanup = cleanupRoom;
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [clientId, roomId, wireDataChannel]);

  useEffect(() => {
    const receivedFileUrls = receivedFileUrlsRef.current;

    return () => {
      for (const url of receivedFileUrls) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  useEffect(() => {
    if (
      transferState !== "sending" &&
      transferState !== "receiving"
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [transferState]);

  const sendSelectedFiles = useCallback(async (files: File[]) => {
    const channel = dataChannelRef.current;

    if (!channel || channel.readyState !== "open") {
      setStatusText("Waiting for another device...");
      setStatusTone("waiting");
      return;
    }

    try {
      setError("");
      setSelectedFiles(files);
      setSentBytes(0);
      setCurrentFileIndex(0);
      const startedAt = Date.now();
      setTransferStartedAt(startedAt);
      setNow(startedAt);
      setTransferState("sending");
      setStatusText("Sending file...");
      setStatusTone("connected");

      let completedBytes = 0;

      for (const [index, file] of files.entries()) {
        setCurrentFileIndex(index);
        await sendFileOverDataChannel(file, channel, (fileSentBytes) => {
          setSentBytes(completedBytes + fileSentBytes);
        });
        completedBytes += file.size;
        setSentBytes(completedBytes);
        addRecentTransfer({
          name: file.name,
          size: file.size,
          direction: "sent",
          completedAt: new Date().toISOString()
        });
      }

      setTransferState("complete");
      setStatusText("Transfer complete");
      setStatusTone("complete");
      notifyTransferComplete();
    } catch (transferError) {
      setStatusText("Transfer failed");
      setStatusTone("error");
      setError(
        transferError instanceof Error
          ? transferError.message
          : "The transfer could not be completed."
      );
    }
  }, [addRecentTransfer, notifyTransferComplete]);

  async function copyInviteLink() {
    if (!shareLink) {
      return;
    }

    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function handleFilesSelected(files: File[]) {
    setError("");
    setSelectedFiles(files);
    setCurrentFileIndex(0);
    setSentBytes(0);
    setTransferStartedAt(null);
    setTransferState("idle");

    if (!channelOpen) {
      setStatusText("Files ready. Waiting for another device...");
      setStatusTone("waiting");
      return;
    }

    setStatusText(files.length > 1 ? "Files ready to send" : "File ready to send");
    setStatusTone("connected");
  }

  const activeFileSize =
    role === "sender"
      ? selectedFiles.reduce((total, file) => total + file.size, 0)
      : incomingMetadata?.filesize ?? 0;
  const activeBytes = role === "sender" ? sentBytes : receivedBytes;
  const progress = activeFileSize
    ? Math.min(100, Math.round((activeBytes / activeFileSize) * 100))
    : 0;
  const activeFileName =
    role === "sender"
      ? selectedFiles.length > 1
        ? `${selectedFiles.length} files selected`
        : selectedFiles[0]?.name
      : incomingMetadata?.filename;
  const elapsedSeconds = transferStartedAt
    ? Math.max(((now || transferStartedAt) - transferStartedAt) / 1000, 0.001)
    : 0;
  const speedBytesPerSecond = activeBytes > 0 ? activeBytes / elapsedSeconds : 0;
  const remainingBytes = Math.max(activeFileSize - activeBytes, 0);
  const etaSeconds = speedBytesPerSecond
    ? remainingBytes / speedBytesPerSecond
    : 0;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="grain-overlay pointer-events-none absolute inset-0" />
      <div className="ambient-grid pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="ambient-orb-alt pointer-events-none absolute right-[-8rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-driftViolet/10 blur-3xl" />
      <div className="ambient-orb pointer-events-none absolute bottom-[-12rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-driftBlue/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="reveal-now mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-3" href="/">
            <Image
              alt="Drift Transfer logo"
              className="h-9 w-9 object-contain"
              height={36}
              src="/drift_transfer_logo.svg"
              width={36}
            />
            <span className="font-medium tracking-[0.24em] text-white">
              DRIFT TRANSFER
            </span>
          </Link>
          <StatusBadge tone={statusTone}>{statusText}</StatusBadge>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="premium-card reveal-now rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-glow backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-driftBlue">
              🚪 Room {roomId}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
              Invite a friend. Let the file drift.
            </h1>
            <p className="mt-4 text-sm leading-6 text-mist">
              Share this link with exactly one other device. We set up the
              private browser link, then your file moves directly across.
            </p>

            <div className="premium-card mt-8 rounded-3xl border border-white/10 bg-black/20 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-mist">
                🔗 Invite link
              </p>
              <div className="break-all rounded-2xl bg-white/5 p-3 text-sm text-white">
                {shareLink || "Preparing link..."}
              </div>
              <button
                className="magic-button mt-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:opacity-60"
                disabled={!shareLink}
                onClick={copyInviteLink}
                type="button"
              >
                {copied ? "Copied. Go make magic." : "Copy invite link"}
              </button>
            </div>

            <InviteQrCode value={shareLink} />

            <div className="mt-4 rounded-3xl border border-violet-300/15 bg-violet-300/10 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-violet-100">
                🧬 Verify both devices
              </p>
              <p className="text-2xl font-semibold text-white">{verificationCode}</p>
              <p className="mt-2 text-sm leading-6 text-mist">
                Both screens should show the same code before you send anything
                sensitive.
              </p>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-mist">
              <div className="premium-card flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <span>🎭 Your role</span>
                <span className="font-medium text-white">
                  {role === "sender"
                    ? "Sender"
                    : role === "receiver"
                      ? "Receiver"
                      : "Detecting..."}
                </span>
              </div>
              <div className="premium-card flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <span>⚡ File channel</span>
                <span className="font-medium text-white">
                  {channelOpen ? "Open and ready" : "Warming up"}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-driftBlue/15 bg-driftBlue/10 p-4 text-sm leading-6 text-sky-100">
              💡 Pro tip: keep both tabs open until the transfer is done. No
              tab, no tunnel.
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            {recentTransfers.length ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-mist">
                  🕘 Local history
                </p>
                <div className="grid gap-2">
                  {recentTransfers.map((transfer) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.035] p-3 text-sm"
                      key={`${transfer.direction}-${transfer.name}-${transfer.completedAt}`}
                    >
                      <span className="truncate text-white">{transfer.name}</span>
                      <span className="shrink-0 text-mist">
                        {transfer.direction} · {formatBytes(transfer.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <section className="premium-card reveal-now rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-glow backdrop-blur-2xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-driftViolet">
                  🌊 Transfer deck
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                  {transferState === "complete"
                    ? "Transfer complete. Smooth landing."
                    : role === "receiver"
                      ? "Ready to catch the drop"
                      : "Drop it here and ship it"}
                </h2>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-mist">
                {progress}%
              </div>
            </div>

            <DropZone
              disabled={roomFull || role !== "sender" || transferState === "sending"}
              helperText={
                role === "receiver"
                  ? "Relax. The incoming file will show up here when it drifts in."
                  : channelOpen
                    ? "Drop files or click Choose files. We are live."
                    : "Choose files now. Send unlocks when the other device connects."
              }
              onFilesSelected={handleFilesSelected}
              selectedFileName={activeFileName}
            />

            {role === "sender" && selectedFiles.length > 0 && transferState !== "sending" ? (
              <button
                className="magic-button mt-4 w-full rounded-2xl bg-gradient-to-r from-driftBlue to-driftViolet px-5 py-4 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!channelOpen}
                onClick={() => void sendSelectedFiles(selectedFiles)}
                type="button"
              >
                {channelOpen ? "Woosh, send files" : "Waiting for device link..."}
              </button>
            ) : null}

            <div className="premium-card mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="mb-4 flex flex-col gap-2 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {transferState === "sending"
                    ? "Sending file..."
                    : transferState === "receiving"
                      ? "Receiving file..."
                      : transferState === "complete"
                        ? "Transfer complete"
                        : "Waiting for the drop..."}
                </span>
                <span>
                  {formatBytes(activeBytes)} / {formatBytes(activeFileSize)}
                </span>
              </div>
              <ProgressBar value={progress} />
              {activeFileName ? (
                <p className="mt-4 text-sm text-white">{activeFileName}</p>
              ) : null}
              <div className="mt-4 grid gap-3 text-sm text-mist sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                  <span className="block text-xs uppercase tracking-[0.18em]">
                    Speed
                  </span>
                  <span className="mt-1 block text-white">
                    {speedBytesPerSecond
                      ? `${formatBytes(speedBytesPerSecond)}/s`
                      : "Waiting"}
                  </span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                  <span className="block text-xs uppercase tracking-[0.18em]">
                    ETA
                  </span>
                  <span className="mt-1 block text-white">
                    {transferState === "sending" || transferState === "receiving"
                      ? formatDuration(etaSeconds)
                      : "Ready"}
                  </span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                  <span className="block text-xs uppercase tracking-[0.18em]">
                    Check
                  </span>
                  <span className="mt-1 block text-white">
                    {receivedFile
                      ? receivedFile.verified
                        ? "Verified"
                        : "Mismatch"
                      : role === "sender"
                        ? `File ${Math.min(currentFileIndex + 1, selectedFiles.length || 1)}`
                        : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {receivedFiles.length ? (
              <div className="mt-6 grid gap-3">
                {receivedFiles.map((file) => (
                  <a
                    className="magic-button inline-flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-driftBlue to-driftViolet px-5 py-4 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
                    download={file.name}
                    href={file.url}
                    key={`${file.name}-${file.checksum}`}
                  >
                    <span>Download {file.name}</span>
                    <span>{file.verified ? "Verified" : "Check failed"}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </section>
        </section>

        <footer className="reveal-up mt-8 border-t border-white/10 py-6">
          <div className="flex flex-col gap-3 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
            <p>Made with ❤ by Anthony. Free, open source, no accounts.</p>
            <div className="flex flex-wrap gap-3">
              <a
                className="transition hover:text-white"
                href="https://github.com/antho8101/Drift-Transfer"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <a
                className="transition hover:text-white"
                href="https://github.com/sponsors/antho8101"
                rel="noreferrer"
                target="_blank"
              >
                Sponsor
              </a>
              <span>Browser-to-browser powered</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
