import Image from "next/image";
import { StartTransferButton } from "@/components/StartTransferButton";
import { siteConfig } from "@/lib/site";

const logoPath = "/drift_transfer_logo.svg";

const features = [
  {
    icon: "✨",
    title: "Free forever",
    description:
      "No account, no pricing page, no weird hoops. Just open a room and send."
  },
  {
    icon: "🌊",
    title: "Direct by design",
    description:
      "Your browser creates a private link with the other device, then the file glides across."
  },
  {
    icon: "🔒",
    title: "No storage",
    description:
      "Your files do not hang out on a server. They drift straight to the other browser."
  }
];

const steps = [
  "🚪 Start a room",
  "🔗 Share the invite link",
  "📦 Drop a file",
  "⬇️ Download on the other device"
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteConfig.url}/#webapplication`,
      name: siteConfig.name,
      url: siteConfig.url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any modern browser",
      description: siteConfig.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      featureList: [
        "Direct browser-to-browser file transfer",
        "Direct device-to-device transfer",
        "No user accounts",
        "No server-side file storage",
        "Private room links",
        "Large file chunking"
      ],
      author: {
        "@type": "Person",
        name: "Anthony",
        url: siteConfig.authorUrl
      },
      sameAs: [siteConfig.githubUrl, siteConfig.sponsorUrl]
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.url}/#software`,
      name: siteConfig.name,
      applicationCategory: "File transfer",
      operatingSystem: "Web",
      description: siteConfig.longDescription,
      isAccessibleForFree: true,
      license: `${siteConfig.githubUrl}/blob/main/LICENSE`,
      codeRepository: siteConfig.githubUrl
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.url}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Drift Transfer upload files to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Drift Transfer sends files directly from one browser to another. The app does not store uploaded files on a server."
          }
        },
        {
          "@type": "Question",
          name: "Do I need an account to send files?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Drift Transfer is free to use without accounts, authentication, or a database."
          }
        },
        {
          "@type": "Question",
          name: "Can Drift Transfer send large files?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Files are split into chunks and sent directly between browsers with transfer progress on both sides."
          }
        }
      ]
    }
  ]
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <div className="grain-overlay pointer-events-none absolute inset-0" />
      <div className="ambient-grid pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="ambient-orb pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-driftBlue/10 blur-3xl" />
      <div className="ambient-orb-alt pointer-events-none absolute right-[-10rem] top-1/3 h-[28rem] w-[28rem] rounded-full bg-driftViolet/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <header className="reveal-now flex items-center justify-between gap-6 rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-2xl sm:px-5">
          <div className="flex items-center gap-3">
            <Image
              alt="Drift Transfer logo"
              className="h-9 w-9 object-contain"
              height={36}
              src={logoPath}
              width={36}
            />
            <span className="text-sm font-medium uppercase tracking-[0.32em] text-white">
              Drift Transfer
            </span>
          </div>
          <nav className="hidden items-center gap-2 text-sm text-mist md:flex">
            <a
              className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
              href="/how-it-works"
            >
              How it works
            </a>
            <a
              className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
              href="#open-source"
            >
              Open source
            </a>
            <a
              className="magic-button rounded-full border border-white/10 px-4 py-2 transition hover:border-driftBlue/40 hover:text-white"
              href="https://github.com/antho8101/Drift-Transfer"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </nav>
        </header>

        <section className="grid min-h-[calc(100vh-7rem)] items-center gap-8 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div className="reveal-now" style={{ animationDelay: "90ms" }}>
            <div className="mb-6 inline-flex rounded-full border border-driftBlue/20 bg-driftBlue/10 px-4 py-2 text-sm font-medium text-driftBlue">
              ✨ 100% free, no account, direct transfer
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-white sm:text-7xl lg:text-8xl">
              Big files. Tiny effort. Pure browser magic.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-mist sm:text-xl">
              Drift Transfer is the no-account file drop your group chat wishes
              it had. Open a room, share the link, and let the file glide from
              one browser to another. No cloud upload detour, no account wall.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <StartTransferButton />
              <a
                className="magic-button rounded-full border border-white/10 px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-driftBlue/40 hover:bg-white/10"
                href="https://github.com/sponsors/antho8101"
                rel="noreferrer"
                target="_blank"
              >
                💜 Support the project
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-mist">
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2">
                ⚡ Direct browser link
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2">
                🔒 No server storage
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2">
                🌍 Open source
              </span>
            </div>
          </div>

          <div
            className="float-soft reveal-now rounded-[2.2rem] border border-white/10 bg-white/[0.055] p-5 shadow-glow backdrop-blur-2xl"
            style={{ animationDelay: "180ms" }}
          >
            <div className="rounded-[1.7rem] border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-driftViolet">
                    🚀 Live room
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    Secure device link, vibes included
                  </p>
                </div>
                <div className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-sm text-emerald-200">
                  ✅ Connected
                </div>
              </div>

              <div className="py-8">
                <div className="mx-auto flex max-w-sm items-center justify-between">
                  <div className="h-16 w-16 rounded-3xl border border-white/10 bg-white/[0.06] p-3">
                    <div className="h-full rounded-2xl bg-gradient-to-br from-driftBlue to-driftViolet" />
                  </div>
                  <div className="relative h-px flex-1 bg-gradient-to-r from-driftBlue via-driftViolet to-driftBlue">
                    <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_rgba(125,211,252,0.8)]" />
                  </div>
                  <div className="h-16 w-16 rounded-3xl border border-white/10 bg-white/[0.06] p-3">
                    <div className="h-full rounded-2xl bg-gradient-to-br from-driftViolet to-driftBlue" />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-mist">old-game-build.zip</span>
                  <span className="text-white">84%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-driftBlue to-driftViolet" />
                </div>
                <p className="mt-3 text-sm text-mist">
                  🌊 The file is gliding directly between devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 py-8 md:grid-cols-3">
          {features.map((feature) => (
            <article
                className="premium-card reveal-up rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl"
              key={feature.title}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 leading-7 text-mist">{feature.description}</p>
            </article>
          ))}
        </section>

        <section
          className="grid gap-6 py-12 lg:grid-cols-[0.85fr_1.15fr]"
          id="how"
        >
          <div className="premium-card reveal-up rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-driftBlue">
              🧭 How it works
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
              A tiny handshake, then the fun part.
            </h2>
            <p className="mt-5 leading-8 text-mist">
              Drift Transfer creates a temporary room, connects both browsers,
              then sends the file in small chunks directly to the other device.
              You get a smooth transfer without creating an account.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div
                className="premium-card reveal-up rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6"
                key={step}
              >
                <span className="text-sm text-driftViolet">0{index + 1}</span>
                <p className="mt-4 text-xl font-medium text-white">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="premium-card reveal-up mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-8 shadow-glow backdrop-blur-2xl sm:p-10"
          id="open-source"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-driftViolet">
                🌍 Open source
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
                Built in public. Free because the internet is better that way.
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-mist">
                Drift Transfer is a public GitHub project by Anthony Carayon.
                PRs, bug reports, design polish, and thoughtful product ideas are
                welcome. If this saves you a headache, a sponsor click keeps the
                lights glowing.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                className="magic-button rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-ink transition hover:-translate-y-0.5"
                href="https://github.com/antho8101"
                rel="noreferrer"
                target="_blank"
              >
                ⭐ Anthony on GitHub
              </a>
              <a
                className="magic-button rounded-full border border-driftViolet/30 px-7 py-4 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-driftViolet/10"
                href="https://github.com/sponsors/antho8101"
                rel="noreferrer"
                target="_blank"
              >
                💜 Sponsor the work
              </a>
            </div>
          </div>
        </section>

        <section className="reveal-up grid gap-4 py-8 md:grid-cols-3">
          <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold text-white">
              Does Drift Transfer upload files?
            </h2>
            <p className="mt-3 leading-7 text-mist">
              No. Files move directly between browsers. Drift Transfer does not
              store uploaded files on an app server.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold text-white">
              Is an account required?
            </h2>
            <p className="mt-3 leading-7 text-mist">
              Nope. Start a room, share the link, send the file. No signup and
              no user database.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold text-white">
              Can it handle large files?
            </h2>
            <p className="mt-3 leading-7 text-mist">
              Yes. Files are split into chunks and sent with progress updates on
              both devices.
            </p>
          </article>
        </section>

        <footer className="reveal-up mb-2 border-t border-white/10 py-8">
          <div className="flex flex-col gap-4 text-sm text-mist md:flex-row md:items-center md:justify-between">
            <p>
              Made with ❤ by{" "}
              <a
                className="text-white transition hover:text-driftBlue"
                href="https://github.com/antho8101"
                rel="noreferrer"
                target="_blank"
              >
                Anthony
              </a>
              . Free, open source, no accounts.
            </p>
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
