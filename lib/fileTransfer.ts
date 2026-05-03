export const CHUNK_SIZE = 256 * 1024;
const MAX_BUFFERED_AMOUNT = CHUNK_SIZE * 16;

export type FileMetadata = {
  filename: string;
  filetype: string;
  filesize: number;
};

export type FileControlMessage =
  | ({ kind: "metadata" } & FileMetadata)
  | { kind: "complete" };

export function parseControlMessage(payload: string): FileControlMessage | null {
  try {
    const message = JSON.parse(payload) as FileControlMessage;

    if (message.kind === "metadata" || message.kind === "complete") {
      return message;
    }

    return null;
  } catch {
    return null;
  }
}

export async function sendFileOverDataChannel(
  file: File,
  channel: RTCDataChannel,
  onProgress: (sentBytes: number) => void
) {
  channel.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT / 2;
  channel.send(
    JSON.stringify({
      kind: "metadata",
      filename: file.name,
      filetype: file.type || "application/octet-stream",
      filesize: file.size
    } satisfies FileControlMessage)
  );

  let offset = 0;

  while (offset < file.size) {
    if (channel.readyState !== "open") {
      throw new Error("The peer connection closed during transfer.");
    }

    if (channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
      await waitForBufferedAmountLow(channel);
    }

    const chunk = await file.slice(offset, offset + CHUNK_SIZE).arrayBuffer();
    channel.send(chunk);
    offset += chunk.byteLength;
    onProgress(offset);
  }

  if (channel.bufferedAmount > MAX_BUFFERED_AMOUNT / 2) {
    await waitForBufferedAmountLow(channel);
  }

  channel.send(JSON.stringify({ kind: "complete" } satisfies FileControlMessage));
}

function waitForBufferedAmountLow(channel: RTCDataChannel) {
  return new Promise<void>((resolve, reject) => {
    const handleLow = () => {
      cleanup();
      resolve();
    };

    const handleClose = () => {
      cleanup();
      reject(new Error("The data channel closed before buffered data was sent."));
    };

    const cleanup = () => {
      channel.removeEventListener("bufferedamountlow", handleLow);
      channel.removeEventListener("close", handleClose);
      channel.removeEventListener("error", handleClose);
    };

    channel.addEventListener("bufferedamountlow", handleLow, { once: true });
    channel.addEventListener("close", handleClose, { once: true });
    channel.addEventListener("error", handleClose, { once: true });
  });
}
