import { StartTransferButton } from "@/components/StartTransferButton";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <section className="relative w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 shadow-glow backdrop-blur-2xl sm:p-12">
        <div className="mb-12 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-driftBlue to-driftViolet shadow-lg shadow-sky-500/20" />
            <span className="text-sm font-medium uppercase tracking-[0.32em] text-mist">
              Drift Transfer
            </span>
          </div>
          <div className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-mist sm:block">
            Peer-to-peer
          </div>
        </div>

        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-driftBlue">
            Browser to browser
          </p>
          <h1 className="text-5xl font-semibold tracking-[-0.06em] text-white sm:text-7xl">
            Let files drift directly between devices.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-mist">
            Send large files directly from browser to browser. No accounts, no
            database, no server-side file storage.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <StartTransferButton />
          <p className="text-sm text-mist">
            Uses Ably only for signaling, then WebRTC carries the file.
          </p>
        </div>
      </section>
    </main>
  );
}
