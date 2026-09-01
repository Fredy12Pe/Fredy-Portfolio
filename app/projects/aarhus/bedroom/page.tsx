"use client";

import { useState } from "react";
import { Icon } from "../ArborChrome";
import BedroomStage, {
  bedRender,
  bedThumb,
  type BedState,
  type Headboard,
} from "../BedroomStage";
import RollingPrice from "../RollingPrice";
import styles from "../aarhus.module.css";

const ASSETS = {
  star: "/projects/aarhus/star.svg",
  divider: "/projects/aarhus/divider.svg",
  led: "/projects/aarhus/led-icon.svg",
  truck: "/projects/aarhus/truck.svg",
  shield: "/projects/aarhus/shield.svg",
  crafted: "/projects/aarhus/crafted.svg",
  bagWhite: "/projects/aarhus/shopping-bag-white.svg",
  bed: "/projects/aarhus/bed.svg",
  craftsmanship: "/projects/aarhus/craftsmanship.jpg",
} as const;

const CONFIGS = [
  { id: "walnut", label: "Fluted Walnut" },
  { id: "upholstered", label: "Upholstered Linen" },
] as const satisfies readonly { id: Headboard; label: string }[];

const PRICES = {
  base: 2180,
  upholstered: 180,
  lamp: 80,
} as const;

const CONFIG_DETAILS = {
  walnut: {
    dimensions: "160W × 200D × 110H cm",
    finish: "Fluted Oiled Walnut",
  },
  upholstered: {
    dimensions: "160W × 200D × 112H cm",
    finish: "Oatmeal Linen, Walnut Frame",
  },
} as const satisfies Record<Headboard, { dimensions: string; finish: string }>;

const GALLERY = [
  { id: "interactive", state: "walnut-off", label: "Interactive bed" },
  { id: "walnut-on", state: "walnut-on", label: "Walnut headboard with lamp on" },
  { id: "upholstered-off", state: "upholstered-off", label: "Upholstered headboard, lamp off" },
  { id: "upholstered-on", state: "upholstered-on", label: "Upholstered headboard with lamp on" },
] as const satisfies readonly { id: string; state: BedState; label: string }[];

export default function BedroomPage() {
  const [headboard, setHeadboard] = useState<Headboard>("walnut");
  const [lampOn, setLampOn] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const price =
    PRICES.base +
    (headboard === "upholstered" ? PRICES.upholstered : 0) +
    (lampOn ? PRICES.lamp : 0);

  const detailRows = [
    { label: "Dimensions", value: CONFIG_DETAILS[headboard].dimensions },
    { label: "Platform", value: "Solid Walnut, No Box Spring" },
    { label: "Materials", value: "FSC® Walnut, Linen, Brass" },
    { label: "Finishes", value: CONFIG_DETAILS[headboard].finish },
    { label: "Warranty", value: "10 Years" },
  ];

  return (
    <>
      <main className={styles.body}>
        <section className={styles.info} aria-label="Product details">
          <div className={styles.productInfo}>
            <div className={styles.titleBlock}>
              <div className={styles.details}>
                <div className={styles.overview}>
                  <div className={styles.headline}>
                    <p className={styles.category}>Bedroom Platform Bed</p>
                    <h1 className={styles.title}>
                      <span className={styles.titleLine1}>The Skagen</span>
                      <span className={styles.titleLine2}>Platform Bed</span>
                    </h1>
                    <div className={styles.rating}>
                      <div className={styles.stars} aria-label="5 star outline rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon key={i} src={ASSETS.star} width={14} height={14} />
                        ))}
                      </div>
                      <p className={styles.ratingCopy}>(24 premium ratings)</p>
                    </div>
                  </div>
                  <p className={styles.description}>
                    A platform bed in fluted{" "}
                    <br aria-hidden />
                    walnut, with a configurable{" "}
                    <br aria-hidden />
                    headboard and a lamp that{" "}
                    <br aria-hidden />
                    warms the room.
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
                <div className={styles.featureGroup}>
                  <div className={styles.featureHeader}>
                    <p className={styles.featureTitle}>Headboard</p>
                    <button type="button" className={styles.learnMore}>
                      Learn More
                    </button>
                  </div>
                  <div
                    className={styles.pills}
                    role="group"
                    aria-label="Headboard"
                  >
                    {CONFIGS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.pill} ${
                          headboard === item.id ? styles.pillSelected : ""
                        }`}
                        aria-pressed={headboard === item.id}
                        onClick={() => setHeadboard(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.ledCard}
                  aria-pressed={lampOn}
                  aria-label="Warm bedside lamp"
                  onClick={() => setLampOn((on) => !on)}
                >
                  <div className={styles.ledCopy}>
                    <Icon src={ASSETS.led} width={21.5} height={21.5} />
                    <div className={styles.ledText}>
                      <p className={styles.ledTitle}>Warm Bedside Lamp</p>
                      <p className={styles.ledDescription}>
                        Brass lamp that pools light on the bed
                        <br aria-hidden />
                        (+ $80)
                      </p>
                    </div>
                  </div>
                  <span
                    className={`${styles.toggle} ${lampOn ? styles.toggleOn : ""}`}
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
                Add Skagen to Space
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
              <BedroomStage
                headboard={headboard}
                lampOn={lampOn}
                onLampChange={setLampOn}
              />
            ) : (
              <img
                className={styles.stageImage}
                src={bedRender(GALLERY[activeThumb].state)}
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
                    <img
                      src={bedThumb(item.state)}
                      alt=""
                      width={94}
                      height={94}
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
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
                  {detailRows.map((row) => (
                    <div key={row.label} className={styles.detailRow}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>

              <article className={`${styles.card} ${styles.cardNarrow}`}>
                <div className={styles.cardCopy}>
                  <h2 className={styles.cardTitle}>Headboard Finishes</h2>
                  <p className={styles.cardDescription}>
                    Fluted walnut or oatmeal linen on the same platform frame.
                  </p>
                </div>
                <span className={styles.cardGraphic} aria-hidden>
                  <img src={ASSETS.bed} alt="" width={148} height={92} />
                </span>
                <button type="button" className={styles.cardLink}>
                  Explore Finishes
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
                    alt="Hands assembling furniture details in the workshop"
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
    </>
  );
}
