# Drift Transfer

Minimal peer-to-peer file transfer app built with Next.js App Router, TypeScript, Tailwind CSS, Ably signaling, and WebRTC DataChannels.

Files are never uploaded to an application server. Ably is used only to exchange WebRTC offers, answers, and ICE candidates.

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_ABLY_API_KEY=your_ably_api_key_here
```

Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`, start a transfer, and open the invite link in a second browser or device.

## Ably

Create an account at https://ably.com, create an app, then copy an API key from the app dashboard. For this MVP, the key is read from `NEXT_PUBLIC_ABLY_API_KEY` and used by the browser for signaling.

## Deploy on Vercel

1. Push the project to a Git provider.
2. Import it in Vercel as a Next.js project.
3. Add `NEXT_PUBLIC_ABLY_API_KEY` in the Vercel project environment variables.
4. Deploy.

## Known Limitations

- Some restrictive networks may require a TURN server, which is not included in this MVP.
- Transfers stop if either browser tab is closed.
- Resume and partial retry are not included.
