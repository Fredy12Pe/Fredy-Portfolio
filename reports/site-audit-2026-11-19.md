# Site audit — 19 Nov 2026

Measured on the live dev server (computed styles, 1440px and 375px) plus a code scan.
Pages: Home, Grove, Samples Store, Sea & Sky, Selah, Tidehaus, ZipLearn. Mood Tracker and Aarhus were only scanned in code.

Priority: **P1** = visible inconsistency or real problem, **P2** = worth fixing, **P3** = tidy-up.

---

## 1. Fonts — P1

| Page | What actually renders |
|---|---|
| Home | Inter (the portfolio layout maps Roboto and Orbitron to Inter) |
| Grove | Inter, plus Sora (design-system section), JetBrains Mono (labels), SF Pro Rounded (sample type) |
| Samples Store, Sea & Sky, Selah, Tidehaus, ZipLearn | **System font (ui-sans-serif / SF Pro on a Mac, Segoe on Windows)**. These pages never get Inter |
| Hero labels on those 5 pages | System monospace (`font-mono`) |

Why: the root layout loads Inter only as a CSS variable and never applies it to `body`. Home sets it in `app/(portfolio)/layout.tsx`, and Grove sets it on its own page, but the other case studies don't.

Also: the root layout loads **Orbitron (6 weights) and Roboto (5 weights) on every page**. Only Mood Tracker and Aarhus still use them; on Home both are overridden to Inter.

**Recommend:** Inter for all text and JetBrains Mono for small uppercase labels, applied once in the root layout. Keep Sora and SF Pro Rounded only inside Grove's design-system samples, since they demonstrate the app's fonts. Load Roboto, Orbitron and Fredoka only on the pages that use them.

## 2. Type sizes — P1

Same role, different sizes:

| Role | Grove | Samples / new 4 | Home |
|---|---|---|---|
| Page title (h1) | 72 / 600 | 72 / 600 ✓ | 70.5 / 400 |
| Section title (h2) | **28 / 500, green** | **36 / 700, black** | 46–100 / 400 |
| Card title (h3) | 24 / 500 | 20 / 500 | 17–46 |
| Body | 18 | 17 (sections), 15 (cards), 14 (problem cards) | 14–16 |
| Small label | 13 mono | 11 / 600 caps | 12–13.7 |
| "Other projects" heading | 30 / 700 | 30 / 700 | — |

Home also has fractional sizes from fluid scaling (13.68, 15.12, 12.96, 23.04, 44.64px). That's fine for the hero, but it means body text drifts between widths.

**Recommend one scale:** 72 h1 · 36 h2 · 24 h3 · 18 body · 15 small body · 12 label (mono caps). Bring Grove's section titles and the kit's titles to the same h2. The Grove green title style can stay as a colour, but at the same size and weight.

## 3. Roundness — P1

Corner radii in use (count across pages): pill ×80+, 24px ×85, 16px ×48, 12px ×28, 60px ×15, 40px ×16, 20px, 18px, 14px, 10px, 8px, 3px, 22px, 32px, 110px.

- Cards are 24px everywhere except **Home (40px and 32px)** and the Other Projects cards (16px outer, 12px image).
- Images are 16px (`rounded-2xl`) in the kit, 24px in Grove and 20px for one Grove image.
- Pills are written three ways (`rounded-full`, `rounded-[60px]`, `rounded-[110px]`). They look the same, so this is a code cleanup only.

**Recommend three values:** 24px for cards and large images, 12px for small images, thumbnails and inner items, and full rounding for pills and buttons. Decide whether Home keeps 40px as its signature or moves to 24.

## 4. Spacing and widths — P2

| | Grove | Kit pages (Samples + 4) |
|---|---|---|
| Content width | 1320px | 1152px (`max-w-6xl`) |
| Hero width | 1320px | 1320px |
| Gap between sections | 140px | 120px |

So on the five kit pages the hero is wider than everything under it, and Grove reads wider than its siblings. **Recommend:** one width for all case studies (1152 or 1320, but the same on every page), with 120px section gaps.

## 5. Colour and contrast — P1 (accessibility)

- **Grove green text fails contrast.** The #00b600 section titles on white are about 2.7:1 (large text needs 3:1), and the hero kicker on the light-green card is about 2.5:1. Darken to roughly #008a00 for text and keep the bright green for fills.
- Faded text in the kit: the "What changed" label is the brand colour at 50% opacity, and hero stats are at 70%. ZipLearn and Sea & Sky are borderline at that size. Use a solid darker shade instead of opacity.
- Body greys: zinc-600, 700 and 800, black/90 and #464646 are all in use for body text. **Pick two:** primary #18181b and secondary #52525b.

## 6. Shared parts that drifted — P2

- **Footers:** Home has its own footer with a signature and socials, while case studies end with a plain black "© 2026 X · Case Study" strip. Use the Home footer everywhere, or a short version of it.
- **"Next project" card:** on the five kit pages but not on Grove. The chain is ZipLearn → Sea & Sky → Selah → Tidehaus → Grove, and Samples → Grove, so Grove links to nothing next.
- **Other Projects** lists Tidehaus but not Aarhus, while Home lists both.
- **CTA buttons:** "Check out live site" is 229×50 pill on case studies, and Home uses different buttons. One button style would help.
- **Hero meta:** Grove uses Stack/Roles chips, the kit pages use Timeline/Roles/Team/Status. Pick one set.

## 7. Images and media — P1 (weight)

The public folder is 441MB. Biggest offenders:

| File | Size | Note |
|---|---|---|
| grove-closing-clip.mp4 | 60MB | Autoplays on the Grove page. Re-encode to about 5–8MB |
| project-brief/videos/*.MP4 (Grove) | 29 + 21 + 16 + 11 + 9MB | Check if still used (old board pages) |
| videos/selahRecord.mp4 | 19MB | Plays in a 200px phone frame. Can be far smaller |
| about-portrait.png | 7.9MB | Use WebP/AVIF, about 300KB |
| tidehaus-screen-record.mp4 | 6.2MB | Fine-ish, compress |
| hero-figma.png (Samples) | 4.2MB | Compress |
| music/*.mp3 | ~5–14MB each | Only loaded on play; fine if lazy |

All images have alt text. Some decorative hero art uses `alt=""`, which is correct.

## 8. Responsive — P2

- No sideways scrolling at 375px on Home, Grove, Samples, Selah or Tidehaus. The Home marquee overflows on purpose and is clipped.
- Home has about 20 links and buttons smaller than 44×44px on a phone (nav icons, social icons, music controls). That's below the recommended touch size.
- Not yet checked: tablet (768) for the five kit pages, and the kit hero at 1024–1280, where the two-column layout starts.

## 9. Accessibility — P2

- One `h1` per page on every page checked ✓
- Reduced motion is respected in 55 places, including the case-study reveals ✓
- Only 18 files style `focus-visible`. The case-study cards, Next-project link and Other Projects cards have no visible focus style beyond the browser default.
- The Selah phone video has no controls and autoplays muted. Fine, but a pause control is better practice.
- Contrast: see section 5.

## 10. Content consistency — P2

- Samples Store is called **"E-Commerce"** on the Other Projects cards, "Samples Store" on Home and the page title, and "Arktura" in the hero.
- **"Ziplearn"** in Home data and the tab title vs **"ZipLearn"** on the page.
- Selah is "Selah" on cards, "Selah Devotional Journal" on Home and the tab, and "Selah Reflect" in the hero.
- The Home blurb for Tidehaus still says "dark, mobile-first storefront", and the page is no longer dark.
- Tab titles: Mood Tracker is "· Fredy Design" and Aarhus is "Modular Living · Arbor & Co.", while the rest are "· Case Study · Fredy".

## 11. Leftovers — P3

Unrouted or old code still in the repo:
- `legacy-page.tsx` in ecommerce, sea-and-sky, selah-reflect, tidehaus, ziplearn
- `app/projects/board/*` and the `*Board.tsx` files in each project (old FigJam-style pages)
- Routes still live: `/case-study-preview`, `/redesign`, `/webgl-test`
- Possibly unused media in `public/projects/grove/project-brief/videos` (~85MB)

**Recommend:** confirm nothing links to them, then delete. Git keeps the history.

---

## Suggested fix order
1. Fonts: apply Inter and JetBrains Mono site-wide and stop loading unused fonts globally (1 file, fixes 5 pages)
2. Type scale and radii: set them in the kit, then bring Grove and the Other Projects cards in line
3. Grove green contrast and faded kit text
4. Same content width on every case study, and Next project on Grove
5. Names and blurbs (E-Commerce → Samples Store, ZipLearn, Selah, Tidehaus blurb, tab titles)
6. Compress the big videos and images
7. Footer and focus styles
8. Delete leftovers

---

## Fixes applied (19 Nov 2026)

1. **Fonts:** Inter and JetBrains Mono now load once in the root layout and apply to every page. Roboto loads only on Aarhus, and Orbitron only on Mood Tracker. Grove uses the shared fonts and keeps Sora for its design-system samples.
2. **Type scale and radii:** section titles are 36px semibold everywhere (30px on phones), body text 18px, card text 15px, labels 12px mono. Corners are 24px for cards and images, 16px for card thumbnails, and full rounding for pills and buttons.
3. **Samples Store** now uses the shared case-study kit under its Figma hero, so it can't drift from the others.
4. **Contrast:** Grove's green text is now #007a12. Faded labels and stats on the kit pages are now solid colours.
5. **Width:** all case studies use the 1320px column with 120px section gaps. Grove now has a Next project card (→ Samples Store).
6. **Names:** "Samples Store" on the cards, plus "ZipLearn", "Selah", the Tidehaus blurb and the Mood Tracker tab title.
7. **Media:** Grove clip 60→12MB, Selah 19→6.3MB, Tidehaus 6.2→2MB, Samples hero 4.2→1.1MB. The public folder went from 441MB to 278MB.
8. **Footer and focus:** case studies end with the home page footer. Cards, Next project and buttons show a focus ring.
9. **Removed:** legacy pages, the old board pages, `/webgl-test`, `/case-study-preview`, the unused Grove board videos and the unused About portrait.

Not changed: Home's 40px card corners and fluid type (its own design), small tap targets on Home, and the music files.
