import type { Metadata } from "next";
import Link from "next/link";
import { StartTransferButton } from "@/components/StartTransferButton";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how Drift Transfer sends files directly between browsers without accounts or server-side file storage."
};

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8">
      <div className="grain-overlay pointer-events-none absolute inset-0" />
      <div className="ambient-grid pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="ambient-orb pointer-events-none absolute left-[-8rem] top-[-8rem] h-[32rem] w-[32rem] rounded-full bg-driftBlue/10 blur-3xl" />
      <div className="ambient-orb-alt pointer-events-none absolute bottom-[-10rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-driftViolet/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <header className="reveal-now flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-5 py-4 backdrop-blur-2xl">
          <Link className="text-sm font-medium uppercase tracking-[0.32em] text-white" href="/">
            Drift Transfer
          </Link>
          <StartTransferButton />
        </header>

        <section className="py-16">
          <p className="mb-5 inline-flex rounded-full border border-driftBlue/20 bg-driftBlue/10 px-4 py-2 text-sm font-medium text-driftBlue">
            🧭 How it works
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-white sm:text-7xl">
            A private room, a direct link, and your file glides across.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-mist">
            Drift Transfer keeps the experience simple. You create a room, invite
            one other device, choose files, and send them directly from browser
            to browser.
          </p>
        </section>

        <section className="grid gap-4 pb-16 md:grid-cols-2">
          {[
            ["1", "Open a room", "A short private room link is created instantly."],
            ["2", "Invite one device", "Send the link or scan the QR code from the second device."],
            ["3", "Verify the code", "Both screens show the same short verification phrase."],
            ["4", "Send files", "Files are split into chunks and sent directly with live progress."],
            ["5", "Download locally", "The receiver rebuilds the files in the browser and downloads them."],
            ["6", "Nothing stored", "No account, no database, no server-side file storage."]
          ].map(([number, title, description]) => (
            <article
              className="premium-card reveal-up rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6"
              key={title}
            >
              <span className="text-sm text-driftViolet">0{number}</span>
              <h2 className="mt-4 text-2xl font-semibold text-white">{title}</h2>
              <p className="mt-3 leading-7 text-mist">{description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
