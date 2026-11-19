"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { RevealBlock } from "../grove/Reveal";
import SiteFooter from "../../(portfolio)/SiteFooter";

// The building blocks of a case study page, in the style of the Samples Store and Grove pages:
// a rounded hero card, then sections that fade in as they scroll into view.
// Each page passes a Theme so it keeps its own brand colour on the same light layout.

export type Theme = {
  /** Headings, hero text and buttons */
  ink: string;
  /** Hero card and card backgrounds */
  tint: string;
  /** Chips on the hero card */
  chip: string;
  /** Gradient for the timeline numbers */
  gradient: string;
};

export const SECTION = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 min-[1400px]:px-0 mt-[80px] min-[1360px]:mt-[120px]";
export const CARD = "rounded-[24px] bg-white p-6 ring-1 ring-zinc-200 sm:p-8";
export const LABEL = "font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-zinc-600";
export const BODY = "text-[18px] leading-[28px] text-zinc-600";

type Src = string | StaticImageData;

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-300">
      {children}
    </p>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-[30px] font-semibold leading-[38px] tracking-[-0.9px] text-zinc-900 sm:text-[36px] sm:leading-[44px]">{children}</h2>;
}

/* A screen or photo inside a rounded frame, with an optional caption */
export function Shot({ src, alt, caption, sizes = "(min-width: 1024px) 720px, 100vw" }: { src: Src; alt: string; caption?: string; sizes?: string }) {
  const sized = typeof src === "string" ? { width: 1200, height: 800 } : {};
  return (
    <figure>
      <div className="overflow-hidden rounded-[24px] bg-white ring-1 ring-inset ring-zinc-200">
        <Image src={src} alt={alt} {...sized} sizes={sizes} className="block h-auto w-full object-contain" />
      </div>
      {caption ? <figcaption className="mt-3 text-sm text-zinc-600">{caption}</figcaption> : null}
    </figure>
  );
}

/* ───────────── Hero ───────────── */

export function CaseHero({
  theme,
  kicker,
  title,
  summary,
  meta,
  stats,
  image,
  imageAlt,
  cta,
  imageClassName = "",
}: {
  imageClassName?: string;
  theme: Theme;
  kicker: string;
  title: ReactNode;
  summary: ReactNode;
  meta: { label: string; values: string[] }[];
  stats: [string, string][];
  image: Src;
  imageAlt: string;
  cta?: { href: string; label: string };
}) {
  return (
    <header className="mx-auto w-full max-w-[1320px] px-5 pt-10 sm:px-8 min-[1400px]:px-0">
      <div className="relative grid overflow-hidden rounded-[24px] xl:min-h-[760px] xl:grid-cols-[58%_42%]" style={{ background: theme.tint }}>
        <div className="flex flex-col justify-center gap-8 px-6 py-10 sm:px-12 sm:py-14 xl:py-20 xl:pl-[13%] xl:pr-0">
          <RevealBlock mount delay={0}>
            <p className="text-[14px] leading-[20px] tracking-[1.8px]" style={{ color: theme.ink }}>
              {kicker}
            </p>
          </RevealBlock>
          <div className="flex flex-col gap-8">
            <RevealBlock mount delay={0.12}>
              <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-1.5px] sm:text-[56px] min-[1360px]:text-[72px] min-[1360px]:leading-[76px] min-[1360px]:tracking-[-2.5px]" style={{ color: theme.ink }}>
                {title}
              </h1>
            </RevealBlock>
            <RevealBlock mount delay={0.24}>
              <p className="max-w-[650px] text-[18px] leading-[26px] tracking-[-0.2px] text-black min-[1360px]:text-[22px] min-[1360px]:leading-[32px]">{summary}</p>
            </RevealBlock>
          </div>
          <RevealBlock mount delay={0.36}>
            <dl className="grid w-fit gap-3">
              {meta.map((m) => (
                <div key={m.label} className="flex items-center gap-4">
                  <dt className="w-[80px] shrink-0 font-mono text-[12px] font-medium uppercase leading-[20px] tracking-[0.08em] text-zinc-800">{m.label}</dt>
                  <dd className="flex flex-wrap gap-2.5">
                    {m.values.map((v) => (
                      <span key={v} className="whitespace-nowrap rounded-full px-[18px] py-2 text-[16px] leading-6 tracking-[-0.2px] text-black" style={{ background: theme.chip }}>
                        {v}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealBlock>
          {cta ? (
            <RevealBlock mount delay={0.44}>
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[50px] w-[229px] items-center justify-center rounded-full text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 tracking-[1px] text-white transition-transform hover:scale-[1.03]"
                style={{ background: theme.ink }}
              >
                {cta.label}
              </a>
            </RevealBlock>
          ) : null}
          <RevealBlock mount delay={0.5} className="flex flex-col gap-6 sm:flex-row sm:gap-10">
            {stats.map(([v, t]) => (
              <p key={v} className="text-[16px] font-medium leading-6 tracking-[-0.2px] text-zinc-800">
                {v}
                <br />
                {t}
              </p>
            ))}
          </RevealBlock>
        </div>

        <RevealBlock mount delay={0.2} className="relative flex items-center justify-center px-6 pb-10 xl:p-10">
          <Image src={image} alt={imageAlt} {...(typeof image === "string" ? { width: 1200, height: 800 } : {})} priority sizes="(min-width: 1280px) 560px, 90vw" className={`block h-auto max-h-[640px] w-full max-w-[560px] object-contain ${imageClassName}`} />
        </RevealBlock>
      </div>
    </header>
  );
}

/* ───────────── Problems ───────────── */

export function ProblemCards({
  theme,
  eyebrow = "Problems",
  title,
  items,
  takeaway,
}: {
  theme: Theme;
  eyebrow?: string;
  title: string;
  items: { title: string; problem: string; fix: string }[];
  takeaway?: ReactNode;
}) {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <H2>{title}</H2>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((p, i) => (
          <RevealBlock as="li" key={p.title} from="up" delay={i * 0.1} className="flex flex-col justify-center gap-10 rounded-[24px] px-[40px] py-10" style={{ background: theme.tint }}>
            <div className="flex flex-col gap-2.5">
              <h3 className="text-[24px] font-semibold leading-[30px]" style={{ color: theme.ink }}>{p.title}</h3>
              <p className="text-[15px] leading-[24px] text-zinc-800">{p.problem}</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className={LABEL}>What changed</p>
              <p className="text-[15px] leading-[24px] text-zinc-800">{p.fix}</p>
            </div>
          </RevealBlock>
        ))}
      </ul>
      {takeaway ? (
        <RevealBlock delay={0.3} className="mt-4 rounded-[24px] px-[40px] py-10" style={{ background: theme.tint }}>
          <p className="text-[15px] leading-[24px] text-zinc-800">Takeaway: {takeaway}</p>
        </RevealBlock>
      ) : null}
    </RevealBlock>
  );
}

/* ───────────── Role and team ───────────── */

export function RoleAndTeam({ theme, columns }: { theme: Theme; columns: { head: string; items: ReactNode[] }[] }) {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>Role and team</Eyebrow>
      <H2>My role and team</H2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {columns.map((col, i) => (
          <RevealBlock key={col.head} from="up" delay={i * 0.1} className="rounded-[24px] px-[40px] py-10" style={{ background: theme.tint }}>
            <p className={LABEL}>{col.head}</p>
            <ul className="mt-4 space-y-3 text-[15px] leading-6 text-zinc-800">
              {col.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-800" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </RevealBlock>
        ))}
      </div>
    </RevealBlock>
  );
}

/* ───────────── Constraints ───────────── */

export function Constraints({ items }: { items: string[] }) {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>Constraints</Eyebrow>
      <H2>Constraints</H2>
      <ul className="mt-6 flex flex-wrap gap-2">
        {items.map((c, i) => (
          <RevealBlock as="li" key={c} from="up" delay={i * 0.06}>
            <span className="inline-flex items-center rounded-full bg-zinc-200/80 px-4 py-2 text-sm font-medium text-zinc-800 ring-1 ring-zinc-900/10">{c}</span>
          </RevealBlock>
        ))}
      </ul>
    </RevealBlock>
  );
}

/* ───────────── Decisions ───────────── */

export function DecisionBlock({
  title,
  rows,
  visual,
  reverse = false,
  wide = false,
}: {
  title: string;
  rows: { k: string; v: ReactNode }[];
  visual: ReactNode;
  reverse?: boolean;
  wide?: boolean;
}) {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className={`grid gap-8 ${wide ? "" : "md:grid-cols-2"} md:items-start ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <Eyebrow>Decision</Eyebrow>
          <H2>{title}</H2>
          <dl className="mt-6 space-y-5">
            {rows.map((r) => (
              <div key={r.k}>
                <dt className={LABEL}>{r.k}</dt>
                <dd className={`mt-1 ${BODY}`}>{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>{visual}</div>
      </div>
    </RevealBlock>
  );
}

/* ───────────── Results ───────────── */

export function Results({ theme, title = "Results", intro, items }: { theme: Theme; title?: string; intro?: ReactNode; items: { value: string; text: string; source: string }[] }) {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>Results</Eyebrow>
      <H2>{title}</H2>
      {intro ? <p className={`mt-4 max-w-3xl ${BODY}`}>{intro}</p> : null}
      <ul className={`mt-8 grid gap-4 ${items.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"}`}>
        {items.map((r, i) => (
          <RevealBlock as="li" key={r.value + r.text} from="up" delay={i * 0.1} className={`${CARD} flex flex-col`}>
            <p className="text-4xl font-bold tracking-tight" style={{ color: theme.ink }}>{r.value}</p>
            <p className="mt-2 text-[15px] text-zinc-700">{r.text}</p>
            <p className="mt-auto pt-6 text-xs text-zinc-500">{r.source}</p>
          </RevealBlock>
        ))}
      </ul>
    </RevealBlock>
  );
}

/* ───────────── How I built it ───────────── */

export function HowIBuiltIt({
  theme,
  timeline,
  tools,
  wentWrong,
  extra,
}: {
  theme: Theme;
  timeline: { t: string; d: string }[];
  tools: string;
  wentWrong: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>How I built it</Eyebrow>
      <H2>How I built it</H2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className={CARD}>
          <p className={LABEL}>Timeline</p>
          <ol className="mt-4 space-y-4">
            {timeline.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: theme.gradient }}>
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-zinc-900">{s.t}</p>
                  <p className="text-[15px] leading-6 text-zinc-700">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-4">
          <div className={CARD}>
            <p className={LABEL}>Built with</p>
            <p className="mt-3 text-[15px] leading-6 text-zinc-800">{tools}</p>
          </div>
          <div className={CARD}>
            <p className={LABEL}>What went wrong</p>
            <p className="mt-3 text-[15px] leading-6 text-zinc-800">{wentWrong}</p>
          </div>
        </div>
      </div>
      {extra ? <div className="mt-8">{extra}</div> : null}
    </RevealBlock>
  );
}

/* ───────────── Where it stands ───────────── */

export function WhereItStands({ stands, change, measure }: { stands: ReactNode; change: ReactNode; measure: ReactNode }) {
  const cards: [string, ReactNode][] = [
    ["Where it stands", stands],
    ["What I’d change", change],
    ["What I’d measure first", measure],
  ];
  return (
    <RevealBlock as="section" className={SECTION}>
      <Eyebrow>Where it stands</Eyebrow>
      <H2>Where it stands and what I&apos;d change</H2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map(([label, text], i) => (
          <RevealBlock key={label} from="up" delay={i * 0.1} className={CARD}>
            <p className={LABEL}>{label}</p>
            <p className="mt-3 text-[15px] leading-6 text-zinc-800">{text}</p>
          </RevealBlock>
        ))}
      </div>
    </RevealBlock>
  );
}

/* ───────────── Next project, footer ───────────── */

export function NextProject({ href, name }: { href: string; name: string }) {
  return (
    <RevealBlock as="section" className={`${SECTION} mb-6`}>
      <Link href={href} className="group flex items-center justify-between rounded-[24px] bg-zinc-950 p-6 text-white outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 sm:p-8">
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Next project</span>
          <span className="mt-2 block text-2xl font-semibold tracking-tight">{name}</span>
        </span>
        <span className="text-2xl transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </RevealBlock>
  );
}

/* The site's footer, the same one the home page ends with */
export function CaseFooter() {
  return <SiteFooter />;
}
