import Image from "next/image";
import Link from "next/link";
import styles from "./aarhus.module.css";
import PrefetchAarhusScenes from "./PrefetchAarhusScenes";

const INTERACTIONS = [
  {
    href: "/projects/aarhus/living-room",
    src: "/projects/aarhus/console/closed-2door.webp",
    category: "Living Room",
    title: "The Helsingør",
    label: "Center console",
  },
  {
    href: "/projects/aarhus/wardrobe",
    src: "/projects/aarhus/carousel/wardrobe-interactive.png",
    category: "Modular Systems",
    title: "The Aarhus",
    label: "Two-door wardrobe",
  },
  {
    href: "/projects/aarhus/bedroom",
    src: "/projects/aarhus/bedroom/walnut-off.webp",
    category: "Bedroom",
    title: "The Skagen",
    label: "Platform bed",
  },
  {
    href: "/projects/aarhus/dining-room",
    src: "/projects/aarhus/dining/walnut-4.png",
    category: "Dining Room",
    title: "The Odense",
    label: "Dining table",
  },
] as const;

export default function AarhusIntroPage() {
  return (
    <main className={styles.intro}>
      <PrefetchAarhusScenes />
      <div className={styles.introCopy}>
        <h1 className={styles.introTitle}>Modular Living</h1>
        <p className={styles.introLead}>
          A case study in product interaction — four configurable pieces,
          each with a spatial scene you can open, light, and rearrange.
        </p>
      </div>

      <div className={styles.introRail}>
        {INTERACTIONS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={styles.introCard}
            aria-label={`${item.title}, ${item.label}`}
          >
            <Image
              src={item.src}
              alt=""
              fill
              sizes="(max-width: 720px) 86vw, (max-width: 1100px) 42vw, 360px"
              quality={70}
              priority
            />
            <span className={styles.introCardCopy}>
              <span className={styles.introCardCategory}>{item.category}</span>
              <span className={styles.introCardTitle}>{item.title}</span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
