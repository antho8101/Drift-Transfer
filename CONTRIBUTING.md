# 🤝 Contributing to Drift Transfer

Thanks for helping improve Drift Transfer. The project should stay simple, free, privacy-respecting, and easy to understand.

## ✨ Principles

- ⚡ Keep file transfer peer-to-peer.
- 🔒 Do not add accounts, databases, or server-side file storage.
- 🛰️ Use Ably only for signaling unless a proposal clearly explains why that should change.
- 🧠 Prefer readable code over clever abstractions.
- 🌙 Keep the UI calm, premium, and minimal.

## 🚀 Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your Ably API key to `.env.local`:

```env
NEXT_PUBLIC_ABLY_API_KEY=your_ably_api_key_here
```

## ✅ Before Opening a Pull Request

Run:

```bash
npm run lint
npm run build
```

Please include:

- what changed;
- why it changed;
- how you tested it;
- screenshots or short recordings for UI changes.

## 🌱 Good First Contributions

- 💬 Improve empty states and error states.
- 🧯 Add better transfer failure explanations.
- ♿ Improve keyboard and screen reader accessibility.
- 📚 Document deployment and Ably setup more clearly.
- 🧭 Explore optional TURN configuration.

## 🔐 Security and Privacy

Never commit `.env.local`, API keys, credentials, or test files containing private data. If you find a security issue, please follow `SECURITY.md`.
