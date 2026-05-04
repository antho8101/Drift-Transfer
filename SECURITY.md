# 🔐 Security Policy

## ✅ Supported Versions

Drift Transfer is currently an MVP. Security reports should target the latest version on the `main` branch.

## 🧯 Reporting a Vulnerability

Please do not open a public issue for sensitive security problems.

Report vulnerabilities privately to the maintainer with:

- a clear description of the issue;
- steps to reproduce;
- affected browser or environment;
- any suggested fix, if available.

## ⚠️ Important Notes

- Files should never be uploaded to Drift Transfer servers.
- Ably should only be used for signaling messages.
- Do not commit API keys, `.env`, or credentials.
- Prefer server-side `ABLY_API_KEY` with `/api/ably-token` for public deployments.
- Treat any `NEXT_PUBLIC_*` key as public because it is exposed to the browser.
- WebRTC may reveal network information to the connected peer; this is inherent to direct browser-to-browser transfer.

For production-scale public use, scoped Ably token authentication is recommended and already supported by the app.
