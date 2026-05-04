import Image from "next/image";
import Link from "next/link";

export function ForbiddenView() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8">
      <div className="grain-overlay pointer-events-none absolute inset-0" />
      <div className="ambient-grid pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="ambient-orb pointer-events-none absolute left-[-8rem] top-[-8rem] h-[32rem] w-[32rem] rounded-full bg-driftBlue/10 blur-3xl" />
      <div className="ambient-orb-alt pointer-events-none absolute bottom-[-10rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-driftViolet/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <header className="reveal-now flex items-center justify-between gap-6 rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-2xl sm:px-5">
          <Link className="flex items-center gap-3" href="/">
            <Image
              alt="Drift Transfer logo"
              className="h-9 w-9 object-contain"
              height={36}
              src="/drift_transfer_logo.svg"
              width={36}
            />
            <span className="text-sm font-medium uppercase tracking-[0.32em] text-white">
              Drift Transfer
            </span>
          </Link>
          <span className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-sm text-red-100">
            403
          </span>
        </header>

        <section className="flex flex-1 items-center py-16">
          <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="reveal-now">
              <p className="mb-5 inline-flex rounded-full border border-driftViolet/20 bg-driftViolet/10 px-4 py-2 text-sm font-medium text-violet-200">
                🔒 Access paused
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.07em] text-white sm:text-7xl">
                This room is not yours to enter.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-mist">
                Looks like this link is private, expired, or simply not meant
                for this device. No drama. Start a fresh transfer room and get
                back to sending files in a few seconds.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  className="magic-button rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-ink shadow-2xl shadow-sky-500/20 transition hover:-translate-y-0.5"
                  href="/"
                >
                  Start a new transfer
                </Link>
                <a
                  className="magic-button rounded-full border border-white/10 px-7 py-4 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-driftBlue/40 hover:bg-white/10"
                  href="https://github.com/antho8101/Drift-Transfer"
                  rel="noreferrer"
                  target="_blank"
                >
                  View on GitHub
                </a>
              </div>
            </div>

            <div className="float-soft reveal-now rounded-[2.2rem] border border-white/10 bg-white/[0.055] p-5 shadow-glow backdrop-blur-2xl">
              <div className="rounded-[1.7rem] border border-white/10 bg-black/30 p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-driftBlue">
                      Private link
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      Access check failed
                    </p>
                  </div>
                  <div className="rounded-full bg-red-300/10 px-3 py-1.5 text-sm text-red-100">
                    Locked
                  </div>
                </div>

                <div className="space-y-4 py-6">
                  <div className="premium-card rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-mist">Room permission</span>
                      <span className="text-red-100">Denied</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-red-300 to-driftViolet" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-driftBlue/15 bg-driftBlue/10 p-4 text-sm leading-6 text-sky-100">
                    💡 Tip: ask the sender for a fresh invite link, or create a
                    new room from the homepage.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="reveal-up border-t border-white/10 py-6">
          <div className="flex flex-col gap-3 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
            <p>Made with ❤ by Anthony. Free, open source, no accounts.</p>
            <div className="flex flex-wrap gap-3">
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
