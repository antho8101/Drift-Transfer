# 🌊 Drift Transfer

Free, open-source peer-to-peer file transfer for the browser.

Drift Transfer lets two people send large files directly from one browser to another with WebRTC DataChannels. Ably is used only for signaling. Files are not uploaded to Drift Transfer servers, there are no accounts, and there is no database.

[🚀 Start exploring the project](https://github.com/antho8101/Drift-Transfer) · [⭐ Follow Anthony on GitHub](https://github.com/antho8101) · [💜 Sponsor the work](https://github.com/sponsors/antho8101)

## ✨ Why Drift Transfer?

- **💸 100% free**: no account, no subscription, no artificial server-side upload limit.
- **⚡ Peer-to-peer**: files move directly between browsers after the connection is established.
- **🔒 No server storage**: the app does not store uploaded files because files are not uploaded to the app.
- **🧱 Simple stack**: Next.js, TypeScript, Tailwind CSS, Ably signaling, WebRTC DataChannel.
- **🌍 Community-friendly**: small codebase, readable architecture, contribution files included.

## 🧭 How It Works

1. 🚪 The sender starts a room and shares an invite link.
2. 🔗 The second device joins the same room.
3. 🛰️ Ably exchanges WebRTC signaling messages: offer, answer, ICE candidates, and presence.
4. ⚡ WebRTC opens one DataChannel named `file-transfer`.
5. 📦 The sender sends file metadata, then 256 KB chunks.
6. ⬇️ The receiver rebuilds the file as a Blob and downloads it locally.

Ably does not carry the file payload. It only helps the two browsers discover how to connect.

## 🛠️ Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Ably Realtime for signaling
- WebRTC DataChannel for file transfer
- Vercel-ready deployment

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_ABLY_API_KEY=your_ably_api_key_here
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`, start a transfer, copy the invite link, then open it in a second browser, private window, or another device.

## 🛰️ Ably Setup

1. Create an account at https://ably.com.
2. Create a new Ably app.
3. Copy an API key from the Ably dashboard.
4. Add it to `.env.local` as `NEXT_PUBLIC_ABLY_API_KEY`.

For this MVP, the browser uses the public Ably key directly. For a larger public deployment, consider replacing this with token authentication from a server route so permissions can be scoped per room.

Required Ably capabilities:

- `publish`
- `subscribe`
- `presence`

## 🧪 Useful Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## ▲ Deploy on Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add `NEXT_PUBLIC_ABLY_API_KEY` in the Vercel environment variables.
4. Deploy.

## 📁 Project Structure

```text
app/
  page.tsx
  room/[roomId]/page.tsx
components/
  DropZone.tsx
  ProgressBar.tsx
  RoomClient.tsx
  StartTransferButton.tsx
  StatusBadge.tsx
lib/
  ably.ts
  fileTransfer.ts
  utils.ts
  webrtc.ts
```

## ⚠️ Known Limitations

- Some restrictive networks may require a TURN server.
- Transfers stop if either tab is closed.
- Resume and partial retry are not included.
- Very large transfers depend on browser memory and network stability.

## 🤝 Contributing

Contributions are welcome. Please read `CONTRIBUTING.md` before opening a pull request.

Good first areas:

- 📱 Better mobile transfer states
- 🧭 TURN server configuration support
- 🔁 Transfer resume experiments
- 💬 More robust error messages
- ♿ Accessibility improvements
- ✨ Landing page and documentation polish

## 💜 Support

Drift Transfer is free and open source. If it helps you or you want to support more public tools, you can sponsor Anthony here:

[github.com/sponsors/antho8101](https://github.com/sponsors/antho8101)

## 📄 License

MIT. See `LICENSE`.
