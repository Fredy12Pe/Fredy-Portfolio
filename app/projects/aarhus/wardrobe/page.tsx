"use client";

import { useState } from "react";
import { Icon } from "../ArborChrome";
import BaseWardrobeOpenedClosed from "../BaseWardrobeOpenedClosed";
import DoorToggle from "../DoorToggle";
import GalleryThumb from "../GalleryThumb";
import RollingPrice from "../RollingPrice";
import styles from "../aarhus.module.css";

const ASSETS = {
  bagWhite: "/projects/aarhus/shopping-bag-white.svg",
  star: "/projects/aarhus/star.svg",
  divider: "/projects/aarhus/divider.svg",
  led: "/projects/aarhus/led-icon.svg",
  truck: "/projects/aarhus/truck.svg",
  shield: "/projects/aarhus/shield.svg",
  crafted: "/projects/aarhus/crafted.svg",
  modularWardrobe: "/projects/aarhus/modular-wardrobe.svg",
  craftsmanship: "/projects/aarhus/craftsmanship.jpg",
} as const;

const DETAIL_ROWS = [
  { label: "Dimensions", value: "120W × 60D × 220H cm" },
  { label: "Materials", value: "FSC® Timber, Steel" },
  { label: "Finishes", value: "Matte Lacquer" },
  { label: "Warranty", value: "10 Years" },
  { label: "Lead Time", value: "2–4 Weeks" },
] as const;

type DoorPanel = "standard" | "mirror";
type Interior = "single" | "double";

const PRICES = {
  base: 1850,
  doubleColumn: 350,
  mirror: 220,
  led: 120,
} as const;

const GALLERY = [
  {
    id: "interactive",
    src: "/projects/aarhus/carousel/wardrobe-interactive.png",
    label: "Interactive wardrobe",
  },
  {
    id: "open-light",
    src: "/projects/aarhus/carousel/wardrobe-open-light.png",
    label: "Open wardrobe with interior light",
  },
  {
    id: "closed-glass",
    src: "/projects/aarhus/carousel/wardrobe-closed-glass.png",
    label: "Closed wardrobe with glass door",
  },
  {
    id: "closed-mirror",
    src: "/projects/aarhus/carousel/wardrobe-closed-mirror.png",
    label: "Closed wardrobe with mirror door",
  },
  {
    id: "triple-closed",
    src: "/projects/aarhus/carousel/wardrobe-triple-closed.png",
    label: "Three-door wardrobe closed",
  },
  {
    id: "triple-open",
    src: "/projects/aarhus/carousel/wardrobe-triple-open.png",
    label: "Three-door wardrobe open",
  },
] as const;

export default function AarhusPage() {
  const [doorPanel, setDoorPanel] = useState<DoorPanel>("standard");
  const [interior, setInterior] = useState<Interior>("single");
  const [ledOn, setLedOn] = useState(false);
  const [opened, setOpened] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const price =
    PRICES.base +
    (interior === "double" ? PRICES.doubleColumn : 0) +
    (doorPanel === "mirror" ? PRICES.mirror : 0) +
    (ledOn ? PRICES.led : 0);

  return (
        <main className={styles.body}>
          <section className={styles.info} aria-label="Product details">
            <div className={styles.productInfo}>
              <div className={styles.titleBlock}>
                <div className={styles.details}>
                  <div className={styles.overview}>
                    <div className={styles.headline}>
                      <p className={styles.category}>Modular Bedroom Wardrobe</p>
                      <h1 className={styles.title}>
                        <span className={styles.titleLine1}>The Aarhus</span>
                        <span className={styles.titleLine2}>Two-Door</span>
                      </h1>
                      <div className={styles.rating}>
                        <div className={styles.stars} aria-label="5 star outline rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Icon key={i} src={ASSETS.star} width={14} height={14} />
                          ))}
                        </div>
                        <p className={styles.ratingCopy}>(48 premium ratings)</p>
                      </div>
                    </div>
                    <p className={styles.description}>
                      A refined modular wardrobe offering{" "}
                      <br aria-hidden />
                      customisable storage with timeless{" "}
                      <br aria-hidden />
                      design. Handcrafted for lasting{" "}
                      <br aria-hidden />
                      quality and everyday ease.
                    </p>
                  </div>

                  <div className={styles.priceRow}>
                    <RollingPrice value={price} />
                    <p className={styles.availability}>✓ Handcrafted & In Stock</p>
                  </div>
                </div>

                <span className={styles.divider}>
                  <img src={ASSETS.divider} alt="" width={360} height={1} />
                </span>

                <div className={styles.features}>
                  <DoorToggle
                    opened={opened}
                    onOpenedChange={setOpened}
                    openLabel="Open wardrobe"
                    closeLabel="Close wardrobe"
                  />
                  <div className={styles.featureGroup}>
                    <div className={styles.featureHeader}>
                      <p className={styles.featureTitle}>Right Wardrobe Interior</p>
                      <button type="button" className={styles.learnMore}>
                        Learn More
                      </button>
                    </div>
                    <div
                      className={styles.pills}
                      role="group"
                      aria-label="Right wardrobe interior"
                    >
                      <button
                        type="button"
                        className={`${styles.pill} ${
                          interior === "single" ? styles.pillSelected : ""
                        }`}
                        aria-pressed={interior === "single"}
                        onClick={() => setInterior("single")}
                      >
                        Single Column
                      </button>
                      <button
                        type="button"
                        className={`${styles.pill} ${
                          interior === "double" ? styles.pillSelected : ""
                        }`}
                        aria-pressed={interior === "double"}
                        onClick={() => setInterior("double")}
                      >
                        Double Column
                      </button>
                    </div>
                  </div>

                  <div className={styles.featureGroup}>
                    <div className={styles.featureHeader}>
                      <p className={styles.featureTitle}>Right Door Pannel</p>
                      <button type="button" className={styles.learnMore}>
                        Learn More
                      </button>
                    </div>
                    <div className={styles.pills} role="group" aria-label="Right door panel">
                      <button
                        type="button"
                        className={`${styles.pill} ${
                          doorPanel === "standard" ? styles.pillSelected : ""
                        }`}
                        aria-pressed={doorPanel === "standard"}
                        onClick={() => setDoorPanel("standard")}
                      >
                        Standard
                      </button>
                      <button
                        type="button"
                        className={`${styles.pill} ${
                          doorPanel === "mirror" ? styles.pillSelected : ""
                        }`}
                        aria-pressed={doorPanel === "mirror"}
                        onClick={() => setDoorPanel("mirror")}
                      >
                        Full-Length Mirror
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.ledCard}
                    aria-pressed={ledOn}
                    aria-label="Integrated interior warm LED"
                    onClick={() => {
                      const next = !ledOn;
                      setLedOn(next);
                      if (next) {
                        setOpened(true);
                      }
                    }}
                  >
                    <div className={styles.ledCopy}>
                      <Icon src={ASSETS.led} width={21.5} height={21.5} />
                      <div className={styles.ledText}>
                        <p className={styles.ledTitle}>Integrated Interior Warm LED</p>
                        <p className={styles.ledDescription}>
                          Soft ambient glow when doors open
                          <br aria-hidden />
                          (+ $120)
                        </p>
                      </div>
                    </div>
                    <span
                      className={`${styles.toggle} ${ledOn ? styles.toggleOn : ""}`}
                      aria-hidden
                    >
                      <span className={styles.toggleThumb} />
                    </span>
                  </button>
                </div>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.primaryBtn}>
                  <Icon src={ASSETS.bagWhite} width={16} height={16} />
                  Add Aarhus to Space
                </button>
                <button type="button" className={styles.secondaryBtn}>
                  Schedule Interior Consultation
                </button>
              </div>
            </div>

            <div className={styles.trust}>
              <div className={styles.trustItem}>
                <Icon src={ASSETS.truck} width={28} height={22} />
                <div className={styles.trustCopy}>
                  <p className={styles.trustTitle}>Free Delivery</p>
                  <p className={styles.trustDescription}>On orders over $2,000</p>
                </div>
              </div>
              <div className={styles.trustItem}>
                <Icon src={ASSETS.shield} width={19.25} height={22} />
                <div className={styles.trustCopy}>
                  <p className={styles.trustTitle}>Designed to last</p>
                  <p className={styles.trustDescription}>10 Year Warranty</p>
                </div>
              </div>
              <div className={styles.trustItem}>
                <Icon src={ASSETS.crafted} width={23.147} height={22} />
                <div className={styles.trustCopy}>
                  <p className={styles.trustTitle}>Crafted With Care</p>
                  <p className={styles.trustDescription}>Sustainable Materials</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.gallery} aria-label="Product imagery">
            <div className={styles.stage}>
              {activeThumb === 0 ? (
                <BaseWardrobeOpenedClosed
                  ledOn={ledOn}
                  onLedChange={setLedOn}
                  doorPanel={doorPanel}
                  interior={interior}
                  opened={opened}
                  onOpenedChange={setOpened}
                />
              ) : (
                <img
                  className={styles.stageImage}
                  src={GALLERY[activeThumb].src}
                  alt={GALLERY[activeThumb].label}
                  width={840}
                  height={680}
                />
              )}
            </div>

            <div className={styles.variants}>
              <div className={styles.thumbs} role="list">
                {GALLERY.map((item, index) => {
                  const selected = activeThumb === index;
                  const thumb = (
                    <button
                      type="button"
                      className={styles.thumb}
                      aria-label={item.label}
                      aria-pressed={selected}
                      onClick={() => setActiveThumb(index)}
                    >
                      <GalleryThumb src={item.src} />
                    </button>
                  );

                  return selected ? (
                    <div key={item.id} className={styles.thumbSelectedWrap} role="listitem">
                      {thumb}
                    </div>
                  ) : (
                    <div key={item.id} role="listitem">
                      {thumb}
                    </div>
                  );
                })}
              </div>

              <div className={styles.cards}>
                <article className={`${styles.card} ${styles.cardWide} ${styles.cardDetails}`}>
                  <h2 className={styles.cardTitle}>Details</h2>
                  <dl className={styles.detailList}>
                    {DETAIL_ROWS.map((row) => (
                      <div key={row.label} className={styles.detailRow}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </article>

                <article className={`${styles.card} ${styles.cardNarrow}`}>
                  <div className={styles.cardCopy}>
                    <h2 className={styles.cardTitle}>Modular Design</h2>
                    <p className={styles.cardDescription}>
                      Configure the interior to suit your space and needs.
                    </p>
                  </div>
                  <span className={styles.cardGraphic} aria-hidden>
                    <img
                      src={ASSETS.modularWardrobe}
                      alt=""
                      width={148}
                      height={92}
                    />
                  </span>
                  <button type="button" className={styles.cardLink}>
                    Explore Configurations
                    <span aria-hidden>→</span>
                  </button>
                </article>

                <article className={`${styles.card} ${styles.cardWide}`}>
                  <div className={styles.cardCopy}>
                    <h2 className={styles.cardTitle}>Crafted with Care</h2>
                    <p className={styles.cardDescription}>
                      Sustainably sourced materials. Built to last.
                    </p>
                  </div>
                  <span className={styles.cardPhoto}>
                    <img
                      src={ASSETS.craftsmanship}
                      alt="Hands assembling wardrobe details in the workshop"
                      width={220}
                      height={100}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <button type="button" className={styles.cardLink}>
                    Our Craftsmanship
                    <span aria-hidden>→</span>
                  </button>
                </article>
              </div>
            </div>
          </section>
        </main>
  );
}
