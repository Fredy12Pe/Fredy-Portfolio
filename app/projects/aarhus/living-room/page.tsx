"use client";

import { useState } from "react";
import { Icon } from "../ArborChrome";
import CenterConsoleStage, {
  consoleRender,
  type ConsoleConfig,
  type ConsoleState,
} from "../CenterConsoleStage";
import DoorToggle from "../DoorToggle";
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
  modularConsole: "/projects/aarhus/modular-console.svg",
  craftsmanship: "/projects/aarhus/craftsmanship.jpg",
} as const;

const CONFIGS = [
  { id: "2door", label: "Two Door" },
  { id: "3door", label: "Three Door" },
] as const satisfies readonly { id: ConsoleConfig; label: string }[];

const PRICES = {
  base: 1240,
  threeDoor: 320,
  led: 90,
} as const;

const CONFIG_DETAILS = {
  "2door": { dimensions: "140W × 45D × 50H cm", storage: "Two Adjustable Bays" },
  "3door": { dimensions: "180W × 45D × 50H cm", storage: "Three Bays, Center Drawer" },
} as const satisfies Record<ConsoleConfig, { dimensions: string; storage: string }>;

const GALLERY = [
  { id: "interactive", state: "closed-2door", label: "Interactive console" },
  { id: "closed-3door", state: "closed-3door", label: "Three-door console closed" },
  { id: "open-2door", state: "open-2door", label: "Two-door console open" },
  { id: "light-2door", state: "light-2door", label: "Two-door console open with interior light" },
  { id: "open-3door", state: "open-3door", label: "Three-door console open" },
  { id: "light-3door", state: "light-3door", label: "Three-door console open with interior light" },
] as const satisfies readonly { id: string; state: ConsoleState; label: string }[];

function consoleThumb(state: ConsoleState) {
  return `/projects/aarhus/console/${state}-thumb.webp`;
}

export default function LivingRoomPage() {
  const [config, setConfig] = useState<ConsoleConfig>("2door");
  const [opened, setOpened] = useState(false);
  const [ledOn, setLedOn] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const price =
    PRICES.base +
    (config === "3door" ? PRICES.threeDoor : 0) +
    (ledOn ? PRICES.led : 0);

  // The LED only reads on an open cabinet, matching the rendered states.
  function toggleLed() {
    const next = !ledOn;
    setLedOn(next);
    if (next) {
      setOpened(true);
    }
  }

  const detailRows = [
    { label: "Dimensions", value: CONFIG_DETAILS[config].dimensions },
    { label: "Storage", value: CONFIG_DETAILS[config].storage },
    { label: "Materials", value: "FSC® Walnut, Brass" },
    { label: "Finishes", value: "Fluted Oiled Walnut" },
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
                    <p className={styles.category}>Modular Living Room Console</p>
                    <h1 className={styles.title}>
                      <span className={styles.titleLine1}>The Helsingør</span>
                      <span className={styles.titleLine2}>Center Console</span>
                    </h1>
                    <div className={styles.rating}>
                      <div className={styles.stars} aria-label="5 star outline rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon key={i} src={ASSETS.star} width={14} height={14} />
                        ))}
                      </div>
                      <p className={styles.ratingCopy}>(36 premium ratings)</p>
                    </div>
                  </div>
                  <p className={styles.description}>
                    A low media console in fluted{" "}
                    <br aria-hidden />
                    walnut, with configurable bays{" "}
                    <br aria-hidden />
                    and a quiet silhouette. Handcrafted{" "}
                    <br aria-hidden />
                    for lasting everyday use.
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
                  openLabel="Open cabinet doors"
                  closeLabel="Close cabinet doors"
                />
                <div className={styles.featureGroup}>
                  <div className={styles.featureHeader}>
                    <p className={styles.featureTitle}>Cabinet Configuration</p>
                    <button type="button" className={styles.learnMore}>
                      Learn More
                    </button>
                  </div>
                  <div
                    className={styles.pills}
                    role="group"
                    aria-label="Cabinet configuration"
                  >
                    {CONFIGS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.pill} ${
                          config === item.id ? styles.pillSelected : ""
                        }`}
                        aria-pressed={config === item.id}
                        onClick={() => setConfig(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.ledCard}
                  aria-pressed={ledOn}
                  aria-label="Integrated interior warm LED"
                  onClick={toggleLed}
                >
                  <div className={styles.ledCopy}>
                    <Icon src={ASSETS.led} width={21.5} height={21.5} />
                    <div className={styles.ledText}>
                      <p className={styles.ledTitle}>Integrated Interior Warm LED</p>
                      <p className={styles.ledDescription}>
                        Soft ambient glow when doors open
                        <br aria-hidden />
                        (+ $90)
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
                Add Helsingør to Space
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
              <CenterConsoleStage
                config={config}
                opened={opened}
                onOpenedChange={setOpened}
                ledOn={ledOn}
                onLedChange={setLedOn}
              />
            ) : (
              <img
                className={styles.stageImage}
                src={consoleRender(GALLERY[activeThumb].state)}
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
                      src={consoleThumb(item.state)}
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
                  <h2 className={styles.cardTitle}>Modular Design</h2>
                  <p className={styles.cardDescription}>
                    Reconfigure between two and three bays as your room changes.
                  </p>
                </div>
                <span className={styles.cardGraphic} aria-hidden>
                  <img src={ASSETS.modularConsole} alt="" width={148} height={92} />
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
