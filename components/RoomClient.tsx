"use client";

import Image from "next/image";
import Link from "next/link";
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
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { formatBytes } from "@/lib/utils";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [incomingMetadata, setIncomingMetadata] = useState<FileMetadata | null>(
    null
  );
  const [sentBytes, setSentBytes] = useState(0);
  const [receivedBytes, setReceivedBytes] = useState(0);
  const [transferState, setTransferState] = useState<TransferState>("idle");
  const [receivedFile, setReceivedFile] = useState<ReceivedFile | null>(null);
  const [channelOpen, setChannelOpen] = useState(false);

  const roleRef = useRef<Role>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const chunksRef = useRef<ArrayBuffer[]>([]);
  const metadataRef = useRef<FileMetadata | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const receivedFileUrlRef = useRef<string | null>(null);
  const shareLink = origin ? `${origin}/room/${roomId}` : "";

  const handleControlMessage = useCallback((payload: string) => {
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
      setTransferState("receiving");
      setStatusText("Receiving file...");
      setStatusTone("connected");
      return;
    }

    const metadata = metadataRef.current;

    if (message.kind === "complete" && metadata) {
      const blob = new Blob(chunksRef.current, { type: metadata.filetype });
      const url = URL.createObjectURL(blob);

      if (receivedFileUrlRef.current) {
        URL.revokeObjectURL(receivedFileUrlRef.current);
      }

      receivedFileUrlRef.current = url;
      setReceivedFile({
        url,
        name: metadata.filename,
        type: metadata.filetype,
        size: metadata.filesize
      });
      setReceivedBytes(metadata.filesize);
      setTransferState("complete");
      setStatusText("Transfer complete");
      setStatusTone("complete");
    }
  }, []);

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
          handleControlMessage(event.data);
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
        const ably = createAblyClient(clientId);
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
              setStatusText("Peer link interrupted");
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
        });

        await channel.presence.enter({ joinedAt: Date.now() });
        const members = await channel.presence.get();
        const sortedMembers = members.sort((a, b) => {
          const aJoinedAt = Number(a.data?.joinedAt ?? 0);
          const bJoinedAt = Number(b.data?.joinedAt ?? 0);
          return aJoinedAt - bJoinedAt;
        });
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
    return () => {
      if (receivedFileUrlRef.current) {
        URL.revokeObjectURL(receivedFileUrlRef.current);
      }
    };
  }, []);

  const sendSelectedFile = useCallback(async (file: File) => {
    const channel = dataChannelRef.current;

    if (!channel || channel.readyState !== "open") {
      setStatusText("Waiting for another device...");
      setStatusTone("waiting");
      return;
    }

    try {
      setError("");
      setSelectedFile(file);
      setSentBytes(0);
      setTransferState("sending");
      setStatusText("Sending file...");
      setStatusTone("connected");
      await sendFileOverDataChannel(file, channel, setSentBytes);
      setSentBytes(file.size);
      setTransferState("complete");
      setStatusText("Transfer complete");
      setStatusTone("complete");
    } catch (transferError) {
      setStatusText("Transfer failed");
      setStatusTone("error");
      setError(
        transferError instanceof Error
          ? transferError.message
          : "The transfer could not be completed."
      );
    }
  }, []);

  async function copyInviteLink() {
    if (!shareLink) {
      return;
    }

    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function handleFileSelected(file: File) {
    setError("");
    setSelectedFile(file);
    setSentBytes(0);
    setTransferState("idle");

    if (!channelOpen) {
      setStatusText("File ready. Waiting for another device...");
      setStatusTone("waiting");
      return;
    }

    setStatusText("File ready to send");
    setStatusTone("connected");
  }

  const activeFileSize =
    role === "sender" ? selectedFile?.size ?? 0 : incomingMetadata?.filesize ?? 0;
  const activeBytes = role === "sender" ? sentBytes : receivedBytes;
  const progress = activeFileSize
    ? Math.min(100, Math.round((activeBytes / activeFileSize) * 100))
    : 0;
  const activeFileName =
    role === "sender" ? selectedFile?.name : incomingMetadata?.filename;

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
              disabled={role !== "sender" || transferState === "sending"}
              helperText={
                role === "receiver"
                  ? "Relax. The incoming file will show up here when it drifts in."
                  : channelOpen
                    ? "Drop a file or click Choose file. We are live."
                    : "Choose a file now. Send unlocks when the other device connects."
              }
              onFileSelected={handleFileSelected}
              selectedFileName={activeFileName}
            />

            {role === "sender" && selectedFile && transferState !== "sending" ? (
              <button
                className="magic-button mt-4 w-full rounded-2xl bg-gradient-to-r from-driftBlue to-driftViolet px-5 py-4 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!channelOpen}
                onClick={() => void sendSelectedFile(selectedFile)}
                type="button"
              >
                {channelOpen ? "Woosh, send file" : "Waiting for device link..."}
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
            </div>

            {receivedFile ? (
              <a
                className="magic-button mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-driftBlue to-driftViolet px-5 py-4 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
                download={receivedFile.name}
                href={receivedFile.url}
              >
                Download file
              </a>
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
