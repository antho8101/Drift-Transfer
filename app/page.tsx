"use client";

import {
  RiGithubFill,
  RiHeart3Line,
  RiMacbookLine,
  RiSmartphoneLine
} from "@remixicon/react";
import Image from "next/image";
import { StartTransferButton } from "@/components/StartTransferButton";
import { useLanguage, useTranslations } from "@/components/LanguageProvider";
import { SmartNav } from "@/components/SmartNav";
import { siteConfig } from "@/lib/site";

const logoPath = "/drift_transfer_logo.svg";

export default function Home() {
  const t = useTranslations();
  const { language } = useLanguage();
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
        description: t.home.intro,
        inLanguage: language,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        featureList: t.home.features.map((feature) => feature.title),
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
        inLanguage: language,
        mainEntity: t.home.faq.map((item) => ({
          "@type": "Question",
          name: item.title,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.text
          }
        }))
      }
    ]
  };

  return (
    <main className="isolate relative min-h-screen overflow-hidden px-6 py-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <div className="grain-overlay pointer-events-none absolute inset-0 z-0" />
      <div className="ambient-grid pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="ambient-orb pointer-events-none absolute left-1/2 top-0 z-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-driftBlue/10 blur-3xl" />
      <div className="ambient-orb-alt pointer-events-none absolute right-[-10rem] top-1/3 z-0 h-[28rem] w-[28rem] rounded-full bg-driftViolet/10 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SmartNav className="flex items-center justify-between gap-6 rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-2xl sm:px-5">
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
              {t.home.navHow}
            </a>
            <a
              className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
              href="#open-source"
            >
              {t.home.navOpenSource}
            </a>
            <a
              className="magic-button rounded-full border border-white/10 px-4 py-2 transition hover:border-driftBlue/40 hover:text-white"
              href="https://github.com/antho8101/Drift-Transfer"
              rel="noreferrer"
              target="_blank"
            >
              <span className="inline-flex items-center gap-2">
                <RiGithubFill aria-hidden className="h-[22px] w-[22px]" />
                {t.common.github}
              </span>
            </a>
          </nav>
        </SmartNav>

        <section className="grid min-h-[calc(100vh-7rem)] items-center gap-8 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div className="reveal-now" style={{ animationDelay: "90ms" }}>
            <div className="mb-6 inline-flex rounded-full border border-driftBlue/20 bg-driftBlue/10 px-4 py-2 text-sm font-medium text-driftBlue">
              {t.home.badge}
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              {t.home.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-mist sm:text-lg sm:leading-8">
              {t.home.intro}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <StartTransferButton />
              <a
                className="magic-button rounded-full border border-white/10 px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-driftBlue/40 hover:bg-white/10"
                href="https://github.com/sponsors/antho8101"
                rel="noreferrer"
                target="_blank"
              >
                <span className="inline-flex items-center gap-2">
                  <RiHeart3Line aria-hidden className="h-[22px] w-[22px]" />
                  {t.home.support}
                </span>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-mist">
              {t.home.chips.map((chip) => (
                <span
                  className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2"
                  key={chip}
                >
                  {chip}
                </span>
              ))}
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
                    {t.home.mockRoom}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {t.home.mockTitle}
                  </p>
                </div>
                <div className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-sm text-emerald-200">
                  {t.home.connected}
                </div>
              </div>

              <div className="py-8">
                <div className="mx-auto flex max-w-sm items-center justify-between">
                  <div className="h-16 w-16 rounded-3xl border border-white/10 bg-white/[0.06] p-3">
                    <div className="flex h-full items-center justify-center rounded-2xl bg-gradient-to-br from-driftBlue to-driftViolet">
                      <RiMacbookLine aria-hidden className="h-[26px] w-[26px] text-white" />
                    </div>
                  </div>
                  <div className="relative h-px flex-1 bg-gradient-to-r from-driftBlue via-driftViolet to-driftBlue">
                    <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_rgba(125,211,252,0.8)]" />
                  </div>
                  <div className="h-16 w-16 rounded-3xl border border-white/10 bg-white/[0.06] p-3">
                    <div className="flex h-full items-center justify-center rounded-2xl bg-gradient-to-br from-driftViolet to-driftBlue">
                      <RiSmartphoneLine aria-hidden className="h-[26px] w-[26px] text-white" />
                    </div>
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
                  {t.home.mockFile}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 py-8 md:grid-cols-3">
          {t.home.features.map((feature) => (
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
              {t.home.howEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
              {t.home.howTitle}
            </h2>
            <p className="mt-5 leading-8 text-mist">
              {t.home.howText}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.home.steps.map((step, index) => (
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
                {t.home.openSourceEyebrow}
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
                {t.home.openSourceTitle}
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-mist">
                {t.home.openSourceText}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                className="magic-button rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-ink transition hover:-translate-y-0.5"
                href="https://github.com/antho8101"
                rel="noreferrer"
                target="_blank"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <RiGithubFill aria-hidden className="h-[22px] w-[22px]" />
                  {t.home.anthonyGithub}
                </span>
              </a>
              <a
                className="magic-button rounded-full border border-driftViolet/30 px-7 py-4 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-driftViolet/10"
                href="https://github.com/sponsors/antho8101"
                rel="noreferrer"
                target="_blank"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <RiHeart3Line aria-hidden className="h-[22px] w-[22px]" />
                  {t.home.sponsorWork}
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="reveal-up grid gap-4 py-8 md:grid-cols-3">
          {t.home.faq.map((item) => (
            <article
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6"
              key={item.title}
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-3 leading-7 text-mist">{item.text}</p>
            </article>
          ))}
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
              {t.common.footer.replace("Made with ❤ by Anthony", "")}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="transition hover:text-white"
                href="https://github.com/antho8101/Drift-Transfer"
                rel="noreferrer"
                target="_blank"
              >
                <span className="inline-flex items-center gap-1.5">
                  <RiGithubFill aria-hidden className="h-[22px] w-[22px]" />
                  {t.common.github}
                </span>
              </a>
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
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
