"use client";

import {
  RiDownloadLine,
  RiGithubFill,
  RiHeart3Line,
  RiLink,
  RiSendPlaneLine
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useTranslations } from "@/components/LanguageProvider";
import { ProgressBar } from "@/components/ProgressBar";
import { SmartNav } from "@/components/SmartNav";
import { StatusBadge } from "@/components/StatusBadge";
import { createVerificationCode, formatBytes, formatDuration } from "@/lib/utils";

type Role = "sender" | "receiver" | null;
type IntentRole = "send" | "receive";
type TransferState = "idle" | "sending" | "receiving" | "complete";
type RoomStatusKey =
  | "preparing"
  | "receiving"
  | "complete"
  | "checksumMismatch"
  | "secureLink"
  | "connecting"
  | "interrupted"
  | "fullStatus"
  | "waitingDevice"
  | "joining"
  | "answering"
  | "setupFailed"
  | "filesReadyWaiting"
  | "filesReadyPlural"
  | "filesReadySingular"
  | "sendingFile";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const clientId = useMemo(() => crypto.randomUUID(), []);
  const origin = useSyncExternalStore(
    () => () => undefined,
    () => window.location.origin,
    () => ""
  );
  const [role, setRole] = useState<Role>(null);
  const [copied, setCopied] = useState(false);
  const [statusKey, setStatusKey] = useState<RoomStatusKey>("preparing");
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
  const tRef = useRef(t);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const chunksRef = useRef<ArrayBuffer[]>([]);
  const metadataRef = useRef<FileMetadata | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const receivedFileUrlsRef = useRef<string[]>([]);
  const requestedRole = searchParams.get("role");
  const intentRole: IntentRole = requestedRole === "send" ? "send" : "receive";
  const shareLink = origin ? `${origin}/room/${roomId}?role=receive` : "";
  const verificationCode = createVerificationCode(roomId);
  const statusText = t.room[statusKey];

  useEffect(() => {
    tRef.current = t;
  }, [t]);

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
      setStatusKey("receiving");
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
      setStatusKey(verified ? "complete" : "checksumMismatch");
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
        setStatusKey("secureLink");
        setStatusTone("connected");
      };

      channel.onclose = () => {
        setChannelOpen(false);
      };

      channel.onerror = () => {
        setError(tRef.current.room.channelError);
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
          setStatusKey("connecting");
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
            }).catch(() => setError(tRef.current.room.publishIceError));
          },
          onConnectionStateChange: (state) => {
            if (state === "connected") {
              setStatusKey("secureLink");
              setStatusTone("connected");
            }

            if (state === "failed" || state === "disconnected") {
              setStatusKey("interrupted");
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
            void makeOffer().catch(() => setError(tRef.current.room.setupError));
          }

          void channel.presence.get().then((presenceMembers) => {
            if (presenceMembers.length > 2 && roleRef.current) {
              setError(tRef.current.room.fullEnter);
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
          setStatusKey("fullStatus");
          setStatusTone("error");
          setError(tRef.current.room.fullError);
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
          setStatusKey("waitingDevice");
          setStatusTone("waiting");

          if (sortedMembers.length > 1) {
            await makeOffer();
          }
        } else {
          setStatusKey("joining");
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
            setStatusKey("answering");
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
        setStatusKey("setupFailed");
        setStatusTone("error");
        setError(
          roomError instanceof Error
            ? roomError.message
            : tRef.current.room.setupError
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
      setStatusKey("waitingDevice");
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
      setStatusKey("sendingFile");
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
      setStatusKey("complete");
      setStatusTone("complete");
      notifyTransferComplete();
    } catch (transferError) {
      setStatusKey("setupFailed");
      setStatusTone("error");
      setError(
        transferError instanceof Error
          ? transferError.message
          : tRef.current.room.transferError
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
      setStatusKey("filesReadyWaiting");
      setStatusTone("waiting");
      return;
    }

    setStatusKey(files.length > 1 ? "filesReadyPlural" : "filesReadySingular");
    setStatusTone("connected");
  }

  function switchIntentRole(nextRole: IntentRole) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", nextRole);
    router.replace(`/room/${roomId}?${params.toString()}`, { scroll: false });
  }

  const isOutgoingTransferView =
    transferState === "sending" ||
    (transferState !== "receiving" && intentRole === "send");
  const activeFileSize =
    isOutgoingTransferView
      ? selectedFiles.reduce((total, file) => total + file.size, 0)
      : incomingMetadata?.filesize ?? 0;
  const activeBytes = isOutgoingTransferView ? sentBytes : receivedBytes;
  const progress = activeFileSize
    ? Math.min(100, Math.round((activeBytes / activeFileSize) * 100))
    : 0;
  const activeFileName =
    isOutgoingTransferView
      ? selectedFiles.length > 1
        ? `${selectedFiles.length} ${t.room.filesSelected}`
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
  const canChooseFiles = !roomFull && intentRole === "send";
  const roleLabel =
    intentRole === "send" ? t.room.sendingMode : t.room.receivingMode;
  const roleDescription =
    intentRole === "send"
      ? t.room.sendingDescription
      : t.room.receivingDescription;
  const technicalRoleDescription =
    role === "sender"
      ? t.room.firstDevice
      : role === "receiver"
        ? t.room.secondDevice
        : t.room.detectingOrder;

  return (
    <main className="isolate relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="grain-overlay pointer-events-none absolute inset-0 z-0" />
      <div className="ambient-grid pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="ambient-orb-alt pointer-events-none absolute right-[-8rem] top-[-8rem] z-0 h-[28rem] w-[28rem] rounded-full bg-driftViolet/10 blur-3xl" />
      <div className="ambient-orb pointer-events-none absolute bottom-[-12rem] left-[-10rem] z-0 h-[30rem] w-[30rem] rounded-full bg-driftBlue/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <SmartNav className="reveal-now mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone={statusTone}>{statusText}</StatusBadge>
          </div>
        </SmartNav>

        <section className="grid flex-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="premium-card reveal-now rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-glow backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-driftBlue">
              🚪 Room {roomId}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
              {t.room.heading}
            </h1>
            <p className="mt-4 text-sm leading-6 text-mist">
              {t.room.description}
            </p>

            <div className="mt-6 rounded-3xl border border-driftBlue/15 bg-driftBlue/10 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-sky-100">
                {t.room.thisDevice}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-2xl font-semibold text-white">{roleLabel}</p>
                  <p className="mt-1 text-sm leading-6 text-mist">
                    {roleDescription}
                  </p>
                </div>
                <button
                  className="magic-button rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  onClick={() =>
                    switchIntentRole(intentRole === "send" ? "receive" : "send")
                  }
                  type="button"
                >
                  {t.room.switchTo}{" "}
                  {intentRole === "send" ? t.room.receive : t.room.send}
                </button>
              </div>
              <p className="mt-3 text-xs leading-5 text-mist">
                {technicalRoleDescription}
              </p>
            </div>

            <div className="premium-card mt-8 rounded-3xl border border-white/10 bg-black/20 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-mist">
                <span className="inline-flex items-center gap-2">
                  <RiLink aria-hidden className="h-[22px] w-[22px]" />
                  {t.room.inviteLink}
                </span>
              </p>
              <div className="break-all rounded-2xl bg-white/5 p-3 text-sm text-white">
                {shareLink || t.room.preparingLink}
              </div>
              <button
                className="magic-button mt-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:opacity-60"
                disabled={!shareLink}
                onClick={copyInviteLink}
                type="button"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <RiLink aria-hidden className="h-[22px] w-[22px]" />
                  {copied ? t.room.copied : t.room.copyInvite}
                </span>
              </button>
            </div>

            <InviteQrCode value={shareLink} />

            <div className="mt-4 rounded-3xl border border-violet-300/15 bg-violet-300/10 p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-violet-100">
                {t.room.verify}
              </p>
              <p className="text-2xl font-semibold text-white">{verificationCode}</p>
              <p className="mt-2 text-sm leading-6 text-mist">
                {t.room.verifyText}
              </p>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-mist">
              <div className="premium-card flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <span>{t.room.yourRole}</span>
                <span className="font-medium text-white">
                  {intentRole === "send" ? t.room.sendRole : t.room.receiveRole}
                </span>
              </div>
              <div className="premium-card flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <span>{t.room.fileChannel}</span>
                <span className="font-medium text-white">
                  {channelOpen ? t.room.openReady : t.room.warmingUp}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-driftBlue/15 bg-driftBlue/10 p-4 text-sm leading-6 text-sky-100">
              {t.room.tip}
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            {recentTransfers.length ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-mist">
                  {t.room.history}
                </p>
                <div className="grid gap-2">
                  {recentTransfers.map((transfer) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.035] p-3 text-sm"
                      key={`${transfer.direction}-${transfer.name}-${transfer.completedAt}`}
                    >
                      <span className="truncate text-white">{transfer.name}</span>
                      <span className="shrink-0 text-mist">
                        {transfer.direction === "sent"
                          ? t.room.sentDirection
                          : t.room.receivedDirection}{" "}
                        · {formatBytes(transfer.size)}
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
                  {t.room.transferDeck}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                  {transferState === "complete"
                    ? t.room.completeTitle
                    : intentRole === "receive"
                      ? t.room.receiveTitle
                      : t.room.sendTitle}
                </h2>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-mist">
                {progress}%
              </div>
            </div>

            <DropZone
              disabled={!canChooseFiles || transferState === "sending"}
              helperText={
                intentRole === "receive"
                  ? t.room.receiveHelper
                  : channelOpen
                    ? t.room.sendHelperLive
                    : t.room.sendHelperWaiting
              }
              onFilesSelected={handleFilesSelected}
              selectedFileName={activeFileName}
            />

            {canChooseFiles && selectedFiles.length > 0 && transferState !== "sending" ? (
              <button
                className="magic-button mt-4 w-full rounded-2xl bg-gradient-to-r from-driftBlue to-driftViolet px-5 py-4 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!channelOpen}
                onClick={() => void sendSelectedFiles(selectedFiles)}
                type="button"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <RiSendPlaneLine aria-hidden className="h-[22px] w-[22px]" />
                  {channelOpen ? t.room.sendButton : t.room.waitingLink}
                </span>
              </button>
            ) : null}

            <div className="premium-card mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="mb-4 flex flex-col gap-2 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {transferState === "sending"
                    ? t.room.sendingFile
                    : transferState === "receiving"
                      ? t.room.receiving
                      : transferState === "complete"
                        ? t.room.complete
                        : t.room.waitingDrop}
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
                    {t.room.speed}
                  </span>
                  <span className="mt-1 block text-white">
                    {speedBytesPerSecond
                      ? `${formatBytes(speedBytesPerSecond)}/s`
                      : t.room.waiting}
                  </span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                  <span className="block text-xs uppercase tracking-[0.18em]">
                    {t.room.eta}
                  </span>
                  <span className="mt-1 block text-white">
                    {transferState === "sending" || transferState === "receiving"
                      ? formatDuration(etaSeconds)
                      : t.room.ready}
                  </span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                  <span className="block text-xs uppercase tracking-[0.18em]">
                    {t.room.check}
                  </span>
                  <span className="mt-1 block text-white">
                    {receivedFile
                      ? receivedFile.verified
                        ? t.room.verified
                        : t.room.mismatch
                      : intentRole === "send"
                        ? `${t.room.file} ${Math.min(currentFileIndex + 1, selectedFiles.length || 1)}`
                        : t.room.pending}
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
                    <span className="inline-flex items-center gap-2">
                      <RiDownloadLine aria-hidden className="h-[22px] w-[22px]" />
                      {t.room.download} {file.name}
                    </span>
                    <span>{file.verified ? t.room.verified : t.room.checkFailed}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </section>
        </section>

        <footer className="reveal-up mt-8 border-t border-white/10 py-6">
          <div className="flex flex-col gap-3 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
            <p>{t.common.footer}</p>
            <div className="flex flex-wrap gap-3">
              <a
                className="transition hover:text-white"
                href="https://github.com/antho8101/Drift-Transfer"
                rel="noreferrer"
                target="_blank"
              >
                <span className="inline-flex items-center gap-1.5">
                  <RiGithubFill aria-hidden className="h-[22px] w-[22px]" />
                  {t.common.github}
                </span>
              </a>
              <a
                className="transition hover:text-white"
                href="https://github.com/sponsors/antho8101"
                rel="noreferrer"
                target="_blank"
              >
                <span className="inline-flex items-center gap-1.5">
                  <RiHeart3Line aria-hidden className="h-[22px] w-[22px]" />
                  {t.common.sponsor}
                </span>
              </a>
              <span>{t.common.powered}</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
