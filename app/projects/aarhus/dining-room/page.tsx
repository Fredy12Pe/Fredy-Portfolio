"use client";

import { useState } from "react";
import { Icon } from "../ArborChrome";
import DiningStage, {
  diningRender,
  type DiningImage,
  type SeatCount,
  type TableTop,
} from "../DiningStage";
import RollingPrice from "../RollingPrice";
import styles from "../aarhus.module.css";

const ASSETS = {
  star: "/projects/aarhus/star.svg",
  divider: "/projects/aarhus/divider.svg",
  truck: "/projects/aarhus/truck.svg",
  shield: "/projects/aarhus/shield.svg",
  crafted: "/projects/aarhus/crafted.svg",
  bagWhite: "/projects/aarhus/shopping-bag-white.svg",
  craftsmanship: "/projects/aarhus/craftsmanship.jpg",
} as const;

const TOPS = [
  { id: "walnut", label: "Fluted Walnut" },
  { id: "stone", label: "Travertine" },
] as const satisfies readonly { id: TableTop; label: string }[];

const SEATS = [
  { id: "4", label: "Four" },
  { id: "8", label: "Eight" },
] as const satisfies readonly { id: SeatCount; label: string }[];

const PRICES = {
  base: 2640,
  stone: 480,
  eight: 720,
} as const;

const CONFIG_DETAILS = {
  walnut: { finish: "Fluted Oiled Walnut" },
  stone: { finish: "Travertine, Walnut Pedestal" },
} as const satisfies Record<TableTop, { finish: string }>;

const SEAT_DETAILS = {
  "4": { dimensions: "180W × 100D × 75H cm", seating: "Four Cane Chairs" },
  "8": { dimensions: "220W × 110D × 75H cm", seating: "Eight Cane Chairs" },
} as const satisfies Record<SeatCount, { dimensions: string; seating: string }>;

const GALLERY = [
  { id: "interactive", state: "walnut-4", label: "Interactive dining table" },
  { id: "walnut-6", state: "walnut-6", label: "Walnut table for six" },
  { id: "walnut-8", state: "walnut-8", label: "Walnut table for eight" },
  { id: "stone-4", state: "stone-4", label: "Stone table for four" },
  { id: "stone-6", state: "stone-6", label: "Stone table for six" },
  { id: "stone-8", state: "stone-8", label: "Stone table for eight" },
] as const satisfies readonly { id: string; state: DiningImage; label: string }[];

export default function DiningRoomPage() {
  const [top, setTop] = useState<TableTop>("walnut");
  const [seats, setSeats] = useState<SeatCount>("4");
  const [activeThumb, setActiveThumb] = useState(0);
  const price =
    PRICES.base +
    (top === "stone" ? PRICES.stone : 0) +
    (seats === "8" ? PRICES.eight : 0);

  const detailRows = [
    { label: "Dimensions", value: SEAT_DETAILS[seats].dimensions },
    { label: "Seating", value: SEAT_DETAILS[seats].seating },
    { label: "Materials", value: "FSC® Walnut, Cane, Stone" },
    { label: "Finishes", value: CONFIG_DETAILS[top].finish },
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
                    <p className={styles.category}>Dining Collection</p>
                    <h1 className={styles.title}>
                      <span className={styles.titleLine1}>The Odense</span>
                      <span className={styles.titleLine2}>Dining Table</span>
                    </h1>
                    <div className={styles.rating}>
                      <div className={styles.stars} aria-label="5 star outline rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon key={i} src={ASSETS.star} width={14} height={14} />
                        ))}
                      </div>
                      <p className={styles.ratingCopy}>(18 premium ratings)</p>
                    </div>
                  </div>
                  <p className={styles.description}>
                    An oval dining table in fluted{" "}
                    <br aria-hidden />
                    walnut, with a configurable top{" "}
                    <br aria-hidden />
                    and seating for four to eight.
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
                    <p className={styles.featureTitle}>Tabletop</p>
                    <button type="button" className={styles.learnMore}>
                      Learn More
                    </button>
                  </div>
                  <div className={styles.pills} role="group" aria-label="Tabletop">
                    {TOPS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.pill} ${
                          top === item.id ? styles.pillSelected : ""
                        }`}
                        aria-pressed={top === item.id}
                        onClick={() => setTop(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.featureGroup}>
                  <div className={styles.featureHeader}>
                    <p className={styles.featureTitle}>Seating</p>
                    <button type="button" className={styles.learnMore}>
                      Learn More
                    </button>
                  </div>
                  <div className={styles.pills} role="group" aria-label="Seating">
                    {SEATS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.pill} ${
                          seats === item.id ? styles.pillSelected : ""
                        }`}
                        aria-pressed={seats === item.id}
                        onClick={() => setSeats(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.primaryBtn}>
                <Icon src={ASSETS.bagWhite} width={16} height={16} />
                Add Odense to Space
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
              <DiningStage top={top} seats={seats} />
            ) : (
              <img
                className={styles.stageImage}
                src={diningRender(GALLERY[activeThumb].state)}
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
                      src={diningRender(item.state)}
                      alt=""
                      width={94}
                      height={94}
                      draggable={false}
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
                  <h2 className={styles.cardTitle}>Table Finishes</h2>
                  <p className={styles.cardDescription}>
                    Fluted walnut or travertine on the same pedestal base.
                  </p>
                </div>
                <span className={styles.cardGraphic} aria-hidden>
                  <img
                    src={diningRender("walnut-4")}
                    alt=""
                    width={148}
                    height={92}
                    style={{ objectFit: "cover" }}
                  />
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
