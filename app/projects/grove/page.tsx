import type { Metadata } from "next";
import Image from "next/image";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import OtherProjects from "@/components/sections/OtherProjects";
import BoardNav from "../board/BoardNav";
import { RevealBlock } from "./Reveal";
import { ParallaxArea } from "./Parallax";

// The Grove case study, built from the Figma design (Grove - Case Study).
// Side-by-side layouts match the design at 1360px and wider; below that they stack.

export const metadata: Metadata = {
  title: "Grove · Case Study · Fredy",
  description:
    "Grove is a Tamagotchi-inspired habit tracker for iOS where every completed habit grows a virtual garden. Designed and built end to end.",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grove-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-grove-mono",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-grove-sora",
  display: "swap",
});

const A = "/projects/grove/case-study";

/* ───────────── shared pieces ───────────── */

// Every section is the same 1320px column, with 140px between sections on a wide screen
const SECTION =
  "mx-auto w-full max-w-[1320px] px-5 sm:px-8 min-[1400px]:px-0 mt-[80px] min-[1360px]:mt-[140px]";

const BODY = "text-[18px] leading-[26px] tracking-[-0.2px] text-black/90";
const SUBHEAD = "text-[22px] leading-[28px] md:text-[24px] font-medium tracking-[-0.2px] text-black/90";

const H2 = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h2 className={`text-[28px] leading-[39px] font-medium tracking-[-0.9px] text-[#00b600] ${className}`}>
    {children}
  </h2>
);

// An image shown through a window: the image is placed at (x, y) inside a box, so the box can scale
function Crop({
  src,
  boxW,
  boxH,
  imgW,
  imgH,
  x,
  y,
  radius = 24,
  className = "",
  cover = false,
}: {
  src: string;
  boxW: number;
  boxH: number;
  imgW: number;
  imgH: number;
  x: number;
  y: number;
  radius?: number;
  className?: string;
  cover?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${boxW} / ${boxH}`, borderRadius: radius }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className={`absolute max-w-none ${cover ? "object-cover" : ""}`}
        style={{
          left: `${(-x / boxW) * 100}%`,
          top: `${(-y / boxH) * 100}%`,
          width: `${(imgW / boxW) * 100}%`,
          height: `${(imgH / boxH) * 100}%`,
        }}
      />
    </div>
  );
}

const Arrow = ({ className = "" }: { className?: string }) => (
  <p
    aria-hidden
    className={`shrink-0 self-center text-[32px] leading-[40px] tracking-[-0.2px] text-black/60 max-lg:rotate-90 ${className}`}
  >
    →
  </p>
);

/* ───────────── Sprout, assembled from its parts (Character Development) ───────────── */

function Piece({ box, rotate, children }: { box: CSSProperties; rotate?: string; children: ReactNode }) {
  return (
    <div className="absolute flex items-center justify-center" style={box}>
      <div className="flex-none" style={rotate ? { transform: rotate } : undefined}>
        {children}
      </div>
    </div>
  );
}

function SproutWaving() {
  const part = (src: string, w: number, h: number) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${A}/${src}`} alt="" width={w} height={h} className="block max-w-none" style={{ width: w, height: h }} />
  );
  const abs = (src: string, l: number, t: number, w: number, h: number) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${A}/${src}`} alt="" className="absolute block max-w-none" style={{ left: l, top: t, width: w, height: h }} />
  );
  const shape = (w: number, h: number, r: number) => (
    <div style={{ width: w, height: h, borderRadius: r, backgroundColor: "#c5ea47" }} />
  );
  return (
    <div role="img" aria-label="Sprout, waving" className="relative h-[179px] w-[130px]">
      {abs("sprout-legs.svg", 21.88, 156.59, 76.365, 22.414)}
      <Piece box={{ left: 0, top: 55.94, width: 127.346, height: 43.574 }} rotate="rotate(6.87deg)">
        {part("sprout-hat-shadow.svg", 124.791, 28.86)}
      </Piece>
      <Piece box={{ left: 61.6, top: 4.03, width: 52.727, height: 42.085 }} rotate="rotate(-4.25deg)">
        {part("sprout-leaf-r.svg", 50.012, 38.484)}
      </Piece>
      <Piece box={{ left: 12.86, top: 0, width: 51.128, height: 43.622 }} rotate="rotate(3.29deg)">
        {part("sprout-leaf-l.svg", 48.862, 40.885)}
      </Piece>
      <Piece box={{ left: 66, top: 94, width: 48.747, height: 31.561 }} rotate="rotate(164.75deg) scaleY(-1)">
        {shape(44.949, 20.457, 175)}
      </Piece>
      <Piece box={{ left: 103.32, top: 110.86, width: 11.737, height: 12.096 }} rotate="rotate(-50.22deg)">
        {shape(9.856, 7.067, 120)}
      </Piece>
      <Piece box={{ left: 1.32, top: 103.41, width: 48.999, height: 40.996 }} rotate="rotate(-31.64deg)">
        {shape(44.949, 20.457, 175)}
      </Piece>
      <Piece box={{ left: 1.32, top: 121.99, width: 11.167, height: 9.058 }} rotate="rotate(12.68deg)">
        {shape(9.856, 7.067, 120)}
      </Piece>
      {abs("sprout-shirt.svg", 18.24, 110.83, 87.256, 31.167)}
      {abs("sprout-overalls.svg", 20.07, 110.28, 81.845, 54.926)}
      {abs("sprout-face.svg", 8.57, 43.7, 104.721, 74.704)}
      {abs("sprout-hat.svg", 0.02, 32.73, 127.032, 56.411)}
    </div>
  );
}

/* ───────────── hero ───────────── */

function Pixel({ src, box, rotate, w, h }: { src: string; box: CSSProperties; rotate: string; w: number; h: number }) {
  return (
    <Piece box={{ ...box, position: "absolute" }} rotate={rotate}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${A}/${src}`}
        alt=""
        className="block max-w-none object-cover [image-rendering:pixelated]"
        style={{ width: w, height: h }}
      />
    </Piece>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-[60px] bg-[#e0f49f] px-[18px] py-[8px] text-[15px] leading-[22px] tracking-[-0.2px] text-[#00c42a]">
      {children}
    </span>
  );
}

const MONO_LABEL =
  "[font-family:var(--font-grove-mono),ui-monospace,monospace] text-[13px] leading-[20px] tracking-[-0.42px] uppercase text-[#00c42a]";

function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1320px] px-5 pt-[104px] sm:px-8 md:pt-[130px] min-[1400px]:px-0 min-[1400px]:pt-[150px]">
      <ParallaxArea className="relative overflow-hidden rounded-[24px] bg-[rgba(197,234,71,0.2)] min-[1360px]:h-[876px]">
        <RevealBlock as="p" mount delay={0}  className="absolute left-7 top-7 text-[13px] leading-[20px] tracking-[1.8px] text-[#00b600] md:left-12 md:top-12 min-[1360px]:left-[102px] min-[1360px]:top-[88px]">
          GROVE / HABIT TRACKER
        </RevealBlock>

        <div className="relative flex w-fit max-w-full flex-col gap-8 px-7 pb-6 pt-[92px] md:max-w-[58%] md:px-12 min-[1360px]:absolute min-[1360px]:max-w-full min-[1360px]:left-[102px] min-[1360px]:top-[calc(50%-28px)] min-[1360px]:-translate-y-1/2 min-[1360px]:p-0">
          <div className="flex flex-col gap-6">
            <RevealBlock mount delay={0.15}><h1 className="text-[48px] font-semibold leading-[52px] tracking-[-1.8px] text-[#00b600] md:text-[60px] md:leading-[64px] md:tracking-[-2px] min-[1360px]:text-[72px] min-[1360px]:leading-[76px] min-[1360px]:tracking-[-2.5px]">
              Grow better
              <br />
              habits.
            </h1></RevealBlock>
            <RevealBlock mount delay={0.3}><p className="w-0 min-w-full text-[15px] leading-[24px] tracking-[-0.2px] text-[#00c42a] md:text-[18px] md:leading-[26px]">
              I built Grove, a Tamagotchi-inspired habit tracker for iOS, to make sticking with habits more playful.
              Every completed habit grows your virtual garden. I designed and built the app end to end with help from
              ChatGPT, Claude, and Cursor.
            </p></RevealBlock>
          </div>
          <RevealBlock mount delay={0.45}><dl className="flex flex-col gap-3">
            {(
              [
                ["Stack", ["React Native + Expo", "Typescript", "Rive", "Figma"]],
                ["Roles", ["Product Design", "iOS Developer", "Researcher"]],
              ] as const
            ).map(([label, items]) => (
              <div key={label} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <dt className={`${MONO_LABEL} w-16 shrink-0`}>{label}</dt>
                <dd className="flex flex-wrap gap-[10px]">
                  {items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </dd>
              </div>
            ))}
          </dl></RevealBlock>
        </div>

        {/* On a phone the character sits under the text */}
        <div className="relative mx-auto w-[min(100%,190px)] md:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/hero-sprout-waving.png`} alt="Sprout, the Grove mascot, waving" className="block w-full" />
          {/* The cactus plant beside Sprout, placed as on desktop (as percentages of Sprout's width) */}
          <div aria-hidden className="pointer-events-none absolute" style={{ left: "4%", top: "50%", width: "22.4%", height: "36%" }}>
            <div className="size-full" style={{ transform: "rotate(-18.29deg)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/hero-sprite-cactus.png`} alt="" className="block size-full max-w-none object-contain [image-rendering:pixelated]" />
            </div>
          </div>
        </div>

        <RevealBlock mount delay={0.6}><div
          className={`${MONO_LABEL} relative flex flex-wrap items-center gap-x-7 gap-y-2 px-7 pb-7 pt-6 text-[rgba(0,196,42,0.8)] md:px-12 min-[1360px]:absolute min-[1360px]:bottom-[26px] min-[1360px]:left-[102px] min-[1360px]:p-0`}
        >
          <span>Year: 2026</span>
          <span className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${A}/icon-app-store.svg`} alt="" className="size-6" />
            Coming soon to App Store
          </span>
        </div></RevealBlock>

        {/* The character, placed as in the design from the bottom right corner. On a tablet the whole picture scales down with the card (--s). */}
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 hidden h-[876px] w-[1320px] origin-bottom-right md:block" style={{ transform: "translate3d(calc(var(--mx, 0) * 14px), calc(var(--my, 0) * 8px), 0) scale(var(--s, 1))", transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <Pixel src="hero-sprite-pot-a.png" box={{ left: 836.21, top: 322.56, width: 96.997, height: 152.382 }} rotate="rotate(11.33deg)" w={70.631} h={141.262} />
          <Pixel src="hero-sprite-pot-b.png" box={{ left: 1102, top: 118, width: 90.812, height: 121.309 }} rotate="rotate(-21.67deg)" w={54.45} h={108.899} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${A}/hero-sprout-waving.png`} alt="" className="absolute max-w-none object-cover" style={{ left: 884, top: 287, width: 537, height: 672 }} />
          <div className="absolute bg-[#f3fbda]" style={{ left: 901, top: 736, width: 64, height: 44 }} />
          <div className="absolute bg-[#c5ea47]" style={{ left: 941, top: 736, width: 64, height: 44 }} />
          <Pixel src="hero-sprite-cactus.png" box={{ left: 871, top: 632, width: 190.135, height: 266.783 }} rotate="rotate(-18.29deg)" w={120.565} h={241.13} />
        </div>
      </ParallaxArea>
    </section>
  );
}

function HeroScreens() {
  return (
    <section className="mx-auto mt-6 flex w-full max-w-[1320px] flex-col gap-7 px-5 sm:px-8 min-[1360px]:mt-[60px] min-[1400px]:px-0">
      <RevealBlock delay={0.00}><Crop src={`${A}/hero-game-world.png`} boxW={1320} boxH={641} imgW={2306} imgH={1042} x={493} y={157} className="w-full" /></RevealBlock>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <RevealBlock delay={0.12}><Crop src={`${A}/hero-phone-home.jpg`} boxW={645.652} boxH={630} imgW={938.758} imgH={687} x={146.553} y={29} cover /></RevealBlock>
        <RevealBlock delay={0.24}><Crop src={`${A}/hero-phone-habits.jpg`} boxW={645.652} boxH={630} imgW={938.758} imgH={687} x={146.553} y={29} cover /></RevealBlock>
      </div>
    </section>
  );
}

/* ───────────── research ───────────── */

function Research() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="flex flex-col gap-10 min-[1360px]:flex-row min-[1360px]:items-end min-[1360px]:gap-[80px]">
        <RevealBlock from="left"  className="flex w-full flex-col gap-6 min-[1360px]:w-[658px] min-[1360px]:shrink-0">
          <H2>Research: What existing habit trackers do</H2>
          <div className={`${BODY} flex flex-col gap-[28px]`}>
            <p>
              I started by reviewing 6 habit tracker apps. Most of them centered on streak charts, which show progress
              clearly but give people little to interact with. I then looked at the few apps that used an interactive
              world, including Duolingo and Quabble.
            </p>
            <p>
              One pattern stood out: people seem more invested when there is something to care for. In Quabble, that is a
              duck that depends on you interacting with it. That pushed me toward a design where each habit has its own
              plant that grows when you complete it and wilts when you don’t.
            </p>
            <p>
              These apps also use a mascot to carry the story of their world, so I decided Grove needed one too. That
              became Sprout, a friendly guide who walks around your garden and checks in on your growing plants.
            </p>
            <p>
              This was a competitor review, not user research, so I plan to test whether caring for a plant brings people
              back after the novelty fades.
            </p>
          </div>
        </RevealBlock>
        <RevealBlock from="right"  className="grid w-full max-w-[484px] grid-cols-[219.753fr_230.078fr] gap-[34px] min-[1360px]:w-[484px] min-[1360px]:shrink-0">
          <div className="relative overflow-hidden rounded-[24px]" style={{ aspectRatio: "219.753 / 476" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${A}/research-quabble.png`} alt="Quabble, an app with a care-for-it companion" loading="lazy" className="absolute inset-0 size-full max-w-none object-cover" />
          </div>
          <Crop src={`${A}/research-duolingo.png`} boxW={230.078} boxH={476} imgW={964.399} imgH={551.085} x={367.161} y={37.198} radius={20} cover />
        </RevealBlock>
      </div>
    </RevealBlock>
  );
}

/* ───────────── character ───────────── */

function CharacterArtwork() {
  return (
    <div className="h-[158px] w-[350px] sm:h-[210px] sm:w-[485px]">
      <div className="relative h-[210px] w-[485px] origin-top-left max-sm:scale-[0.72]">
        <div className="absolute left-[356px] top-0">
          <SproutWaving />
        </div>
        <div className="absolute left-0 top-[25px] flex w-[139px] flex-col items-center gap-1">
          <div className="relative h-[153px] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${A}/character-farmer.png`} alt="Early farmer concept for the character" loading="lazy" className="absolute top-0 h-full max-w-none" style={{ left: "-96.08%", width: "196.4%" }} />
          </div>
          <p className="w-full text-center text-[10px] leading-[28px] tracking-[-0.2px] text-[#666]">AI generated</p>
        </div>
        <Crop
          src={`${A}/character-leaf.png`}
          boxW={147}
          boxH={153}
          imgW={471}
          imgH={706}
          x={162}
          y={164}
          radius={0}
          cover
          className="absolute left-[174px] top-[25px] w-[147px]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/icon-arrow-right.svg`} alt="" className="absolute left-[145px] top-[90px] size-6" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/icon-arrow-right.svg`} alt="" className="absolute left-[327px] top-[90px] size-6" />
      </div>
    </div>
  );
}

function Character() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="flex flex-col gap-10 min-[1360px]:flex-row min-[1360px]:items-center min-[1360px]:gap-[80px]">
        <RevealBlock from="left"  className="order-2 min-[1360px]:order-1 min-[1360px]:w-[485px] min-[1360px]:shrink-0">
          <CharacterArtwork />
        </RevealBlock>
        <RevealBlock from="right"  className="order-1 flex w-full flex-col gap-6 min-[1360px]:order-2 min-[1360px]:w-[658px] min-[1360px]:shrink-0">
          <H2>Character Development</H2>
          <div className={`${BODY} flex flex-col gap-[28px]`}>
            <p>
              I first imagined the character as a farmer, since the app is about tending a garden. But when I studied
              the characters in other habit and game apps, I noticed most of them were abstract creatures, not human
              figures. An abstract character is easier to reuse across screens, feels friendlier, and doesn’t need a
              backstory. So I dropped the farmer.
            </p>
            <p>
              Because Grove is about growing habits, a plant like character was the natural fit. After many rounds of
              trial and error, my first pass was a simple leaf, and I refined it until the final Sprout. I stopped when
              it was simple enough to work at icon size, expressive enough to react, and clearly part of the garden.
            </p>
          </div>
        </RevealBlock>
      </div>
    </RevealBlock>
  );
}

/* ───────────── interviews ───────────── */

const FINDINGS = [
  { stat: "6/10", label: "Streak charts help, but the interest fades.", text: "Streaks made it easy to track their habits, but they lost interest after a while." },
  { stat: "7/10", label: "wanted something to care for", text: "A Tamagotchi-style character they had to look after could keep them motivated." },
  { stat: "4/10", label: "Wanted widgets outside the app", text: "Wished other apps let them track habits outside the app." },
];

function Interviews() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="flex max-w-[1165px] flex-col gap-[35px]">
        <div className="flex max-w-[663px] flex-col gap-6">
          <H2>What I found after interviewing 10 people who wanted to track their habits.</H2>
          <p className={BODY}>
            To test my assumptions, I interviewed 10 people who currently use habit tracker apps or have used them in the
            past. Three themes came up:
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 min-[1360px]:gap-[49px]">
          {FINDINGS.map((f, i) => (
            <RevealBlock as="li" from="up" delay={i * 0.12} 
              key={f.stat}
              className="flex min-h-[229px] flex-col items-center justify-center gap-5 rounded-[24px] bg-[#1abd1a] px-[50px] py-[42px] text-center tracking-[-0.2px]"
            >
              <div className="flex w-full max-w-[214px] flex-col gap-2">
                <p className="text-[28px] font-bold leading-[28px] text-white">{f.stat}</p>
                <p className="text-[15px] font-medium text-white/90">{f.label}</p>
              </div>
              <p className="max-w-[206px] text-[13px] text-white/90">{f.text}</p>
            </RevealBlock>
          ))}
        </ul>
        <p className={`${BODY} max-w-[658px] min-[1360px]:pl-[10px]`}>
          These findings shaped Grove directly. The garden became the main feedback, with a progress dashboard still
          available for people who like the charts. I also added home screen widgets so progress stays visible outside
          the app.
        </p>
      </div>
    </RevealBlock>
  );
}

/* ───────────── core loop ───────────── */

const LOOP_STEPS = [
  ["Complete habit"],
  ["Plant grows +", "progress updates"],
  ["Day ends: plant", "stays healthy or wilts"],
  ["Return tomorrow"],
];

function CoreLoop() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="flex max-w-[1191px] flex-col gap-10">
        <div className="flex flex-col gap-6">
          <H2>The core loop</H2>
          <ol className="flex flex-col gap-4 min-[1360px]:flex-row min-[1360px]:items-center min-[1360px]:gap-0">
            {LOOP_STEPS.map((lines, i) => (
              <li key={lines.join("")} className="flex flex-col items-stretch min-[1360px]:flex-row min-[1360px]:items-center">
                <div className="flex h-[86px] w-full items-center rounded-[10px] bg-[#e0f49f] py-[10px] pl-[18px] pr-[10px] text-[15px] tracking-[-0.2px] text-[#1abd1a] min-[1360px]:w-[231px]">
                  <p>
                    {lines.map((line, j) => (
                      <span key={line}>
                        {j > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
                {i < LOOP_STEPS.length - 1 && (
                  <p aria-hidden className="py-1 text-center text-[24px] leading-[28px] text-black/60 min-[1360px]:hidden">↓</p>
                )}
                {i < LOOP_STEPS.length - 1 && (
                  <div aria-hidden className="hidden w-[89px] justify-center min-[1360px]:flex">
                    <div className="relative h-0 w-[31px]">
                      <div className="absolute inset-[-2px_0_0_0]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${A}/line-connector.svg`} alt="" className="block size-full max-w-none" />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
        <div className="relative w-full max-w-[992px]" style={{ aspectRatio: "992 / 2201" }}>
          <Image
            src={`${A}/core-loop-diagram.png`}
            alt="Grove daily growth flow: open the app, choose habits, complete a habit, the plant grows and progress updates, then the day ends with the plant staying healthy or wilting"
            fill
            sizes="(min-width: 1024px) 992px, 100vw"
            className="rounded-[24px] object-cover"
          />
          {/* Patches over the diagram, as in the design */}
          {(
            [
              [106, 110, 505],
              [273, 2120, 338],
              [77, 1240, 338],
            ] as const
          ).map(([x, y, w]) => (
            <div
              key={`${x}-${y}`}
              aria-hidden
              className="absolute bg-[#eaffaf]"
              style={{ left: `${(x / 992) * 100}%`, top: `${(y / 2201) * 100}%`, width: `${(w / 992) * 100}%`, height: `${(35 / 2201) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </RevealBlock>
  );
}

/* ───────────── decisions ───────────── */

function DecisionBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[14px] leading-[28px]">
      <p className={SUBHEAD}>{title}</p>
      {children}
    </div>
  );
}

function GardenDecision() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="flex flex-col gap-10 min-[1360px]:flex-row min-[1360px]:items-center min-[1360px]:gap-[73px]">
        <RevealBlock from="left"  className="flex w-full flex-col gap-10 min-[1360px]:w-[520px] min-[1360px]:shrink-0">
          <H2>Garden &amp; streak charts</H2>
          <div className="flex flex-col gap-8">
            <DecisionBlock title="Insight">
              <p className={BODY}>
                In my interviews, 6 of 10 people said streak charts helped them stay on top of their habits, but they
                lost interest after a while.
              </p>
            </DecisionBlock>
            <DecisionBlock title="Options">
              <ol className={`${BODY} list-decimal space-y-[14px] pl-[30px] min-[1360px]:max-w-[442px]`}>
                <li>A garden only, with no streak charts.</li>
                <li>Charts only, like most habit trackers.</li>
                <li>A garden as the main experience, with the charts still available.</li>
              </ol>
            </DecisionBlock>
            <DecisionBlock title="Chosen & why">
              <p className={BODY}>
                I chose the third option. The garden gives people something to care for, which the interviews said keeps
                them motivated. The progress dashboard stays because the same people said streaks helped them track their
                habits. I didn’t want to replace something useful, only stop it from being the main thing.
              </p>
            </DecisionBlock>
            <DecisionBlock title="Trade-off">
              <p className={BODY}>
                I decided to keep a simpler garden only experience, and a cleaner main screen. The Garden and the
                Progress dashboard were competing for attention, so I kept the dashboard on its own tab.
              </p>
            </DecisionBlock>
          </div>
        </RevealBlock>
        <RevealBlock from="right"  className="grid w-full max-w-[727px] grid-cols-2 items-end gap-4 min-[1360px]:w-[727px] min-[1360px]:shrink-0 min-[1360px]:gap-[33px]">
          {(
            [
              ["decision-garden.png", "Grove garden screen: the player walks around plots of the garden", 753],
              ["decision-progress.png", "Grove progress screen with monthly completion calendars per habit", 754],
            ] as const
          ).map(([file, alt, h]) => (
            <div key={file} className="relative overflow-hidden rounded-[24px]" style={{ aspectRatio: `347 / ${h}` }}>
              <Image src={`${A}/${file}`} alt={alt} fill sizes="(min-width: 1360px) 347px, 45vw" className="object-cover" />
            </div>
          ))}
        </RevealBlock>
      </div>
    </RevealBlock>
  );
}

function WidgetDecision() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="flex flex-col gap-10 min-[1360px]:flex-row min-[1360px]:items-center min-[1360px]:gap-[268px]">
        <RevealBlock from="left"  className="relative order-2 w-full max-w-[338px] overflow-hidden rounded-[24px] min-[1360px]:order-1 min-[1360px]:w-[338px] min-[1360px]:shrink-0" style={{ aspectRatio: "338 / 735" }}>
          <Image
            src={`${A}/widget-sprout.png`}
            alt="Grove home screen widgets: a large garden widget and a small Today’s Habits widget"
            fill
            sizes="338px"
            className="object-cover"
          />
        </RevealBlock>
        <RevealBlock from="right"  className="order-1 flex w-full flex-col gap-10 min-[1360px]:order-2 min-[1360px]:w-[520px] min-[1360px]:shrink-0">
          <H2>Widgets, habits that live outside the app</H2>
          <div className="flex flex-col gap-8">
            <DecisionBlock title="Insight">
              <p className={BODY}>
                4 of the 10 people I interviewed wished other habit apps let them keep track of their habits outside the
                app.
              </p>
            </DecisionBlock>
            <DecisionBlock title="Options">
              <ol className={`${BODY} list-decimal space-y-[14px] pl-[30px] min-[1360px]:max-w-[476px]`}>
                <li>No widgets, keeping everything inside the app.</li>
                <li>One simple widget, such as a completion count.</li>
                <li>Two widgets at different sizes, one showing the garden and one showing today’s progress.</li>
              </ol>
            </DecisionBlock>
            <DecisionBlock title="Chosen & why">
              <p className={BODY}>
                I made two. The large widget shows the garden so you see the thing you’re caring for and how your weekly
                completion is going. The small widget shows today’s completion as a ring, for people who just want a
                quick number.
              </p>
            </DecisionBlock>
            <DecisionBlock title="Trade-off">
              <p className={BODY}>widgets only display progress; you still open the app to complete a habit.</p>
            </DecisionBlock>
          </div>
        </RevealBlock>
      </div>
    </RevealBlock>
  );
}

/* ───────────── app screens ───────────── */

const SCREENS = [
  ["screen-garden.png", "Your habits become a garden"],
  ["screen-habits.png", "Simple daily check-ins"],
  ["screen-home.png", "See your progress at a glance"],
  ["screen-streaks.png", "Keep track of your streaks"],
  ["screen-breathing.png", "Take a mindful break with Sprout"],
  ["widget-sprout.png", "Your Grove, always within reach, as home screen widgets"],
];

function AppScreens() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="flex flex-col gap-10">
        <H2>App screens</H2>
        <ul className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 min-[1360px]:grid-cols-3">
          {SCREENS.map(([file, alt], i) => (
            <RevealBlock as="li" from="up" delay={i * 0.1}  key={`${file}-${alt}`} className="relative overflow-hidden rounded-[24px]" style={{ aspectRatio: "1885 / 4096" }}>
              <Image src={`${A}/${file}`} alt={alt} fill sizes="(min-width: 1360px) 429px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </RevealBlock>
          ))}
        </ul>
      </div>
    </RevealBlock>
  );
}

/* ───────────── design system ───────────── */

const SWATCHES = [
  ["Primary Green", "#C5EA47", "Main accent, primary buttons, checked states, brand highlights", "#c5ea47"],
  ["Dark Green", "#8AA335", "Heading emphasis, contextual text over bright backgrounds", "#8aa335"],
  ["Bright Green", "#BADF3D", "Secondary accent, sub-cards, brand visual decorations", "#badf3d"],
  ["Dark Navy", "#213242", "Primary text, core titles, dark modes, dominant interface elements", "#213242"],
  ["Cool Gray", "#B7BDC1", "Secondary text, disabled icons, placeholders, borders", "#b7bdc1"],
  ["Light Gray", "#F8F9F9", "Card backgrounds, secondary controls, layout sections", "#f8f9f9"],
  ["White", "#FFFFFF", "Default app background, primary cards, clean canvas blocks", "#ffffff"],
  ["Yellow", "#FEE447", "Decorative accent, streak details, gamification highlights", "#fee447"],
] as const;

const TYPE_SCALE = [
  ["Display — 24px", "Grow your mindful habits daily with Grove", "text-[24px] font-semibold"],
  ["Heading — 20px", "Today’s Progress: 3 out of 5 complete", "text-[20px] font-semibold"],
  ["Subheading — 18px", "Let’s take a few calm breaths with Sprout", "text-[18px] font-semibold"],
  [
    "Body — 14px",
    "Habit tracking doesn't have to be clinical. Playful gardening prompts help you stay connected with your routines over long stretches of time.",
    "text-[14px] font-normal",
  ],
] as const;

const SORA = "[font-family:var(--font-grove-sora),system-ui,sans-serif]";
const SF_ROUNDED = "[font-family:'SF_Pro_Rounded',ui-rounded,'SF_Pro_Display',system-ui,sans-serif]";

function DesignSystem() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="flex max-w-[960px] flex-col gap-10">
        <div className="flex flex-col gap-6">
          <H2 className="!text-[#00b600]">Design System</H2>
          <p className={`${BODY} max-w-[476px] !text-black`}>
            A friendly, nature-themed system: lime green for actions, deep navy for text, and rounded type and corners
            for a calm, inviting feel.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className={SUBHEAD}>Principles</h3>
          <ul className="flex flex-wrap gap-[22px]">
            {["Friendly", "Nature themed", "Mindful clarity"].map((p) => (
              <li key={p} className="flex min-w-[144px] items-center justify-center rounded-[60px] border border-[rgba(102,102,102,0.4)] p-[10px] text-[15px] leading-[28px] tracking-[-0.2px] text-black/90">
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className={SUBHEAD}>Color Roles</h3>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {SWATCHES.map(([name, hex, role, color]) => (
              <li key={name} className="flex flex-col gap-3 rounded-[16px] bg-[#e7e7e7] p-4">
                <div
                  className={`h-20 w-full rounded-[8px] ${name === "White" ? "border border-[#e5e8eb]" : ""}`}
                  style={{ backgroundColor: color }}
                />
                <div className={`${SORA} flex flex-col gap-1`}>
                  <p className="text-[13px] font-semibold text-[#213242]">{name}</p>
                  <p className="text-[11px] font-bold text-[#9e9e9e]">{hex}</p>
                  <p className="text-[10px] leading-[1.4] text-[#717171]">{role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-0">
            <h3 className={`${SUBHEAD} whitespace-nowrap`}>Font Type &amp; Scale</h3>
            <div aria-hidden className="relative mx-[28px] hidden h-0 w-[31px] md:block">
              <div className="absolute inset-[-2px_0_0_0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${A}/line-connector.svg`} alt="" className="block size-full max-w-none" />
              </div>
            </div>
            <p className={`${SUBHEAD} md:whitespace-nowrap`}>SF Pro Rounded · 24 / 20 / 18 / 14 px</p>
          </div>
          <div className={`${SF_ROUNDED} flex flex-col justify-center gap-4 rounded-[24px] bg-[#e7e7e7] p-6 md:min-h-[246px]`}>
            {TYPE_SCALE.map(([label, sample, cls]) => (
              <div key={label} className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
                <p className="w-[200px] shrink-0 text-[13px] font-bold text-[#8aa335]">{label}</p>
                <p className={`leading-[1.4] text-[#213242] md:max-w-[458px] ${cls}`}>{sample}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RevealBlock>
  );
}

/* ───────────── how I built it ───────────── */

function Icon({ src, className }: { src: string; className: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="absolute inset-[-4.17%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/${src}`} alt="" className="block size-full max-w-none" />
      </div>
    </div>
  );
}

function TimelineIcon({ kind }: { kind: "pencil" | "build" | "send" | "store" }) {
  return (
    <div aria-hidden className="absolute right-[28px] top-[29px] size-[28px] overflow-hidden">
      {kind === "pencil" && <Icon src="icon-pencil.svg" className="inset-[12.5%]" />}
      {kind === "build" && (
        <div className="absolute inset-[18.75%_12.5%]">
          <div className="absolute inset-[-5%_-4.17%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${A}/icon-build.svg`} alt="" className="block size-full max-w-none" />
          </div>
        </div>
      )}
      {kind === "send" && <Icon src="icon-paper-airplane.svg" className="inset-[12.5%]" />}
      {kind === "store" && (
        <>
          <div className="absolute inset-[12.5%_18.75%]">
            <div className="absolute inset-[-4.17%_-5%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/icon-shopping-bag.svg`} alt="" className="block size-full max-w-none" />
            </div>
          </div>
          <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/2">
            <div className="absolute inset-[-12.5%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/icon-download-arrow.svg`} alt="" className="block size-full max-w-none" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const GREEN_SUB = "text-[22px] leading-[28px] md:text-[24px] font-medium tracking-[-0.2px] text-[rgba(0,182,0,0.9)]";

function Group({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className={GREEN_SUB}>{title}</h3>
      <p className={`${BODY} max-w-[820px]`}>{intro}</p>
      {children}
    </div>
  );
}

function FlowCard({ title, text, dark }: { title: string; text: string; dark?: boolean }) {
  return (
    <div className="flex flex-1 flex-col gap-[6px] rounded-[20px] bg-[#f8f9f9] p-6 tracking-[-0.2px] text-[#191919]">
      <p className={`text-[18px] font-semibold leading-[24px] ${dark ? "text-black/90" : ""}`}>{title}</p>
      <p className="text-[15px] leading-[21px]">{text}</p>
    </div>
  );
}

function Lane({ label, nodes }: { label: string; nodes: [string, string][] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] font-semibold leading-[18px] tracking-[0.8px] text-black/55">{label}</p>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {nodes.map(([t, s], i) => (
          <div key={t} className="flex flex-1 flex-col items-stretch gap-4 lg:flex-row">
            <FlowCard title={t} text={s} />
            {i < nodes.length - 1 && <Arrow className="lg:self-center" />}
          </div>
        ))}
      </div>
    </div>
  );
}

const TIMELINE = [
  ["Design", "~3 months", "Sketches, Figma, Sprout, brand guide", "pencil"],
  ["Build", "~3 months", "Expo app, Supabase, widgets", "build"],
  ["Submitted", "September 2026", "Sent for App Store review", "send"],
  ["App Store", "Coming soon", "Future updates after launch", "store"],
] as const;

const TOOLS = [
  ["Expo + React Native", ["TypeScript", "expo-router navigation", "Zustand state"], true],
  ["Supabase", ["Apple + Google sign-in", "Row-level security", "Avatar storage", "Habit sync across devices", "In-app account deletion"], false],
  ["Rive", ["Sprout’s animations", "Learned in a week from YouTube tutorials", "I had no animation background"], false],
  ["SwiftUI widgets", ["Small and large sizes", "Plant images generated by script", "Fed through shared App Group storage"], false],
  ["Game world", ["Sprout Lands pack by Cup Nooble, reworked to my layout", "Pixel Lab: pixel Sprout and walk cycle", "Custom collision map"], false],
] as const;

const AI_TOOLS = [
  ["ChatGPT", "logo-chatgpt.svg", "Image ideas for the character, game world and layout. I used them as references, then designed in my own taste."],
  ["Cursor", "logo-cursor.svg", "Built the app in Expo from my designs, including the widget code."],
  ["Claude", "logo-claude.svg", "Debugging, using specific agents I set up for it."],
  ["Figma AI", "figma", "Named and cleaned layers so designs moved cleanly to Cursor through the Figma MCP."],
] as const;

function FigmaMark() {
  return (
    <div className="relative size-8 overflow-hidden">
      <div
        className="absolute inset-[0_16.67%]"
        style={{
          WebkitMaskImage: `url(${A}/mask-figma.svg)`,
          maskImage: `url(${A}/mask-figma.svg)`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "32px 32px",
          maskSize: "32px 32px",
          WebkitMaskPosition: "-5.333px 0px",
          maskPosition: "-5.333px 0px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${A}/logo-figma-fill.svg`} alt="" className="block size-full max-w-none" />
      </div>
    </div>
  );
}

function HowIBuiltIt() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="flex flex-col gap-[72px]">
        <div className="flex flex-col gap-6">
          <H2>How I built it</H2>
          <p className={`${BODY} max-w-[820px]`}>
            Grove took about six months from first sketch to App Store submission: roughly three months of design, then
            three of development, at 6–8 hours a week. I was the sole designer and developer. I used AI tools to build
            faster, but the design direction, the game layout and the in app copy were created by me.
          </p>
        </div>

        <Group title="Timeline" intro="Design took the longest. I submitted the app for App Store review in September 2026.">
          <ol className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
            {TIMELINE.map(([title, when, detail, icon], i) => (
              <RevealBlock as="li" from="up" delay={i * 0.1}  key={title} className="flex flex-1 flex-col gap-4 lg:flex-row">
                <div className="relative flex flex-1 flex-col gap-[6px] rounded-[24px] bg-[#e0f49f] p-7 tracking-[-0.2px] text-[rgba(0,196,42,0.9)]">
                  <p className="text-[24px] font-semibold leading-[30px]">{title}</p>
                  <p className="text-[16px] font-medium leading-[22px]">{when}</p>
                  <p className="text-[15px] leading-[21px]">{detail}</p>
                  <TimelineIcon kind={icon} />
                </div>
                {i < TIMELINE.length - 1 && <Arrow />}
              </RevealBlock>
            ))}
          </ol>
        </Group>

        <Group
          title="How it fits together"
          intro={
            <>
              The app stores habits on the phone and syncs to Supabase.
              <br className="hidden lg:block" /> Widgets are a native extension reading progress from shared storage.
            </>
          }
        >
          <div className="flex flex-col gap-9">
            <Lane
              label="HABITS AND ACCOUNTS"
              nodes={[
                ["Grove app", "Expo + React Native, TypeScript"],
                ["Habit store", "On the phone (Zustand)"],
                ["Supabase", "Accounts, habit sync, avatars"],
              ]}
            />
            <Lane
              label="WIDGETS"
              nodes={[
                ["Grove app", "Tracks today’s progress"],
                ["Shared storage", "App Group, JSON snapshots"],
                ["SwiftUI widgets", "Small and large sizes"],
              ]}
            />
          </div>
        </Group>

        <Group title="Built with" intro="Each tool had one job, and each left something I had to learn.">
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {TOOLS.map(([name, bullets, soft], i) => (
              <RevealBlock as="li" from="up" delay={i * 0.1}  key={name} className="flex flex-col items-start gap-[18px] rounded-[24px] bg-[#f8f9f9] p-6 tracking-[-0.2px]">
                <span className={`rounded-[40px] bg-[#1abd1a] px-4 py-2 text-[15px] font-semibold leading-[22px] ${soft ? "text-white/90" : "text-white"}`}>
                  {name}
                </span>
                <ul className="text-[15px] leading-[22px] text-black/90">
                  {bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </RevealBlock>
            ))}
          </ul>
        </Group>

        <Group
          title="How AI fit in"
          intro="I used four tools for four different jobs. The AI sped up the build, but I decided what Grove should look like, what it should say and how the world is laid out."
        >
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AI_TOOLS.map(([name, logo, text], i) => (
              <RevealBlock as="li" from="up" delay={i * 0.1}  key={name} className="flex flex-col items-start gap-3 rounded-[24px] bg-[#f8f9f9] p-7 tracking-[-0.2px]">
                {logo === "figma" ? (
                  <FigmaMark />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`${A}/${logo}`} alt="" className="size-8" />
                )}
                <p className="text-[24px] font-semibold leading-[30px] text-black/90">{name}</p>
                <p className="text-[15px] leading-[22px] text-black/85">{text}</p>
              </RevealBlock>
            ))}
          </ul>
        </Group>

        <Group title="Problems encountered" intro="Early on, Cursor would hallucinate and sometimes delete my code, and a few breakages took days to fix.">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col gap-[10px] self-stretch rounded-[24px] bg-[#1abd1a] p-7 tracking-[-0.2px] text-white/90">
              <p className="text-[22px] font-semibold leading-[28px]">The problem</p>
              <p className="text-[16px] leading-[24px]">
                Vague prompts gave it too much room to guess, and a broken change could take days to untangle.
              </p>
            </div>
            <Arrow />
            <div className="flex flex-1 flex-col gap-[10px] self-stretch rounded-[24px] bg-[#1abd1a] p-7 tracking-[-0.2px] text-white/90">
              <p className="text-[22px] font-semibold leading-[28px]">What worked</p>
              <ul className="text-[16px] leading-[24px]">
                <li>• Very detailed prompts</li>
                <li>• Sketches and reference images</li>
                <li>• Knowledge-base files I updated as the app grew, so the AI stopped re-learning it</li>
              </ul>
            </div>
          </div>
        </Group>
      </div>
    </RevealBlock>
  );
}

function WhereItStands() {
  const cards = [
    ["Where it stands", ["Submitted for App Store review in September 2026", "Coming soon to the App Store"]],
    ["Planned next", ["Leaderboard", "Visit friends’ gardens", "Character customization"]],
    ["What I’d change", ["Write a plan document before designing", "Keep a strict checklist and calendar", "This was my first app, so I jumped into design without a detailed plan"]],
  ] as const;
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="flex flex-col gap-[72px]">
        <div className="flex flex-col gap-6">
          <H2>Where it stands and what I’d change</H2>
          <p className={`${BODY} max-w-[820px]`}>
            Grove has been submitted for App Store review and is launching soon, so I can’t report real usage yet. Here
            is where it stands, what I plan to add, and what I would do differently.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map(([title, items], i) => (
            <RevealBlock as="li" from="up" delay={i * 0.12}  key={title} className="flex flex-col gap-4 rounded-[24px] bg-[#f8f9f9] p-7 tracking-[-0.2px] text-black/90">
              <p className="text-[24px] font-semibold leading-[30px]">{title}</p>
              <ul className="text-[16px] leading-[26px]">
                {items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </RevealBlock>
          ))}
        </ul>
      </div>
    </RevealBlock>
  );
}

/* ───────────── closing clip ───────────── */

// The closing walkthrough. The clip has no audio track. It starts muted so it autoplays on every browser; the viewer can pause and scrub.
function ClosingClip() {
  return (
    <RevealBlock as="section" className={SECTION}>
      <div className="relative w-full overflow-hidden rounded-[24px] bg-[#f8f9f9]" style={{ aspectRatio: "960 / 540" }}>
        <video
          src={`${A}/grove-closing-clip.mp4`}
          className="absolute inset-0 size-full object-cover"
          controls
          controlsList="nomute nodownload"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Grove app walkthrough"
        />
      </div>
    </RevealBlock>
  );
}

/* ───────────── page ───────────── */

export default function GroveCaseStudyPage() {
  return (
    <div
      className={`${inter.variable} ${jetbrains.variable} ${sora.variable} min-h-screen bg-white text-black antialiased`}
      style={{ fontFamily: "var(--font-grove-inter), system-ui, sans-serif" }}
    >
      <BoardNav />
      <main>
        <Hero />
        <HeroScreens />
        <Research />
        <Character />
        <Interviews />
        <CoreLoop />
        <GardenDecision />
        <WidgetDecision />
        <AppScreens />
        <DesignSystem />
        <HowIBuiltIt />
        <WhereItStands />
        <ClosingClip />
        <div className="mt-[80px] min-[1360px]:mt-[140px]">
          <OtherProjects currentProject="grove" />
        </div>
      </main>
    </div>
  );
}
