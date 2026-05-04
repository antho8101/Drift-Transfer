"use client";

import { RiGithubFill, RiHeart3Line, RiRocketLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "@/components/LanguageProvider";
import { SmartNav } from "@/components/SmartNav";
import { appVersion } from "@/lib/appVersion";

export function ForbiddenView() {
  const t = useTranslations();

  return (
    <main className="isolate relative min-h-screen overflow-hidden px-6 py-8">
      <div className="grain-overlay pointer-events-none absolute inset-0 z-0" />
      <div className="ambient-grid pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="ambient-orb pointer-events-none absolute left-[-8rem] top-[-8rem] z-0 h-[32rem] w-[32rem] rounded-full bg-driftBlue/10 blur-3xl" />
      <div className="ambient-orb-alt pointer-events-none absolute bottom-[-10rem] right-[-8rem] z-0 h-[30rem] w-[30rem] rounded-full bg-driftViolet/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <SmartNav className="flex items-center justify-between gap-6 rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-2xl sm:px-5">
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
        </SmartNav>

        <section className="flex flex-1 items-center py-16">
          <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="reveal-now">
              <p className="mb-5 inline-flex rounded-full border border-driftViolet/20 bg-driftViolet/10 px-4 py-2 text-sm font-medium text-violet-200">
                {t.forbidden.badge}
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.07em] text-white sm:text-7xl">
                {t.forbidden.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-mist">
                {t.forbidden.text}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  className="magic-button rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-ink shadow-2xl shadow-sky-500/20 transition hover:-translate-y-0.5"
                  href="/"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <RiRocketLine aria-hidden className="h-[22px] w-[22px]" />
                    {t.forbidden.start}
                  </span>
                </Link>
                <a
                  className="magic-button rounded-full border border-white/10 px-7 py-4 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-driftBlue/40 hover:bg-white/10"
                  href="https://github.com/antho8101/Drift-Transfer"
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <RiGithubFill aria-hidden className="h-[22px] w-[22px]" />
                    {t.forbidden.viewGithub}
                  </span>
                </a>
              </div>
            </div>

            <div className="float-soft reveal-now rounded-[2.2rem] border border-white/10 bg-white/[0.055] p-5 shadow-glow backdrop-blur-2xl">
              <div className="rounded-[1.7rem] border border-white/10 bg-black/30 p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-driftBlue">
                      {t.forbidden.privateLink}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {t.forbidden.failed}
                    </p>
                  </div>
                  <div className="rounded-full bg-red-300/10 px-3 py-1.5 text-sm text-red-100">
                    {t.forbidden.locked}
                  </div>
                </div>

                <div className="space-y-4 py-6">
                  <div className="premium-card rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-mist">{t.forbidden.permission}</span>
                      <span className="text-red-100">{t.forbidden.denied}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-red-300 to-driftViolet" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-driftBlue/15 bg-driftBlue/10 p-4 text-sm leading-6 text-sky-100">
                    {t.forbidden.tip}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="reveal-up border-t border-white/10 py-6">
          <div className="flex flex-col gap-3 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
            <p>{t.common.footer}</p>
            <div className="flex flex-wrap gap-3">
              <a
                className="transition hover:text-white"
                href="https://github.com/sponsors/antho8101"
                rel="noreferrer"
                target="_blank"
              >
                <span className="inline-flex items-center gap-1.5">
                  <RiHeart3Line aria-hidden className="h-[22px] w-[22px]" />
                  {t.common.sponsor}
                </span>
              </a>
              <span>{t.common.powered}</span>
              <span>{appVersion}</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
