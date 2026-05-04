"use client";

import { RiArrowLeftLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { StartTransferButton } from "@/components/StartTransferButton";
import { useTranslations } from "@/components/LanguageProvider";
import { SmartNav } from "@/components/SmartNav";

export function HowItWorksContent() {
  const t = useTranslations();

  return (
    <main className="isolate relative min-h-screen overflow-hidden px-6 py-8">
      <div className="grain-overlay pointer-events-none absolute inset-0 z-0" />
      <div className="ambient-grid pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="ambient-orb pointer-events-none absolute left-[-8rem] top-[-8rem] z-0 h-[32rem] w-[32rem] rounded-full bg-driftBlue/10 blur-3xl" />
      <div className="ambient-orb-alt pointer-events-none absolute bottom-[-10rem] right-[-8rem] z-0 h-[30rem] w-[30rem] rounded-full bg-driftViolet/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <SmartNav className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
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
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="magic-button rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-driftBlue/40 hover:bg-white/10"
              href="/"
            >
              <span className="inline-flex items-center gap-2">
                <RiArrowLeftLine aria-hidden className="h-[22px] w-[22px]" />
                {t.how.back}
              </span>
            </Link>
            <StartTransferButton />
          </div>
        </SmartNav>

        <section className="py-16">
          <p className="mb-5 inline-flex rounded-full border border-driftBlue/20 bg-driftBlue/10 px-4 py-2 text-sm font-medium text-driftBlue">
            {t.how.eyebrow}
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.07em] text-white sm:text-7xl">
            {t.how.title}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-mist">
            {t.how.intro}
          </p>
        </section>

        <section className="grid gap-4 pb-16 md:grid-cols-2">
          {t.how.steps.map(([number, title, description]) => (
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
