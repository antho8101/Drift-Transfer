export const siteConfig = {
  name: "Drift Transfer",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://drift-transfer.vercel.app",
  description:
    "Free browser-to-browser file transfer for iPhone, Windows, Mac, Android, and more. WebRTC-powered, no accounts, no server-side file storage.",
  longDescription:
    "Drift Transfer lets you send large files directly from browser to browser using WebRTC DataChannels, with Ably used only for signaling. It is especially handy for cross-device transfers like moving photos, videos, or documents from iPhone to Windows without accounts or cloud detours.",
  githubUrl: "https://github.com/antho8101/Drift-Transfer",
  authorUrl: "https://github.com/antho8101",
  sponsorUrl: "https://github.com/sponsors/antho8101",
  keywords: [
    "peer-to-peer file transfer",
    "P2P file transfer",
    "WebRTC file transfer",
    "browser file transfer",
    "large file transfer",
    "free file transfer",
    "private file sharing",
    "iPhone to Windows file transfer",
    "transfer files from iPhone to PC",
    "send files from iPhone to Windows",
    "Apple to Windows file transfer",
    "cross-device file transfer",
    "phone to computer file transfer",
    "no account file transfer",
    "serverless file transfer",
    "DataChannel",
    "Ably signaling",
    "Next.js file transfer"
  ]
} as const;
