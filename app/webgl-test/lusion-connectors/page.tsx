"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "./lusion-connectors.module.css";

const Scene = dynamic(
  () => import("./LusionConnectors").then((m) => m.Scene),
  {
    ssr: false,
    loading: () => <div className={styles.canvas} style={{ background: "#141622" }} />,
  }
);

export default function LusionConnectorsPage() {
  return (
    <div className={styles.root}>
      <Link href="/webgl-test" className={styles.back}>
        ← Lab
      </Link>
      <div className={styles.container}>
        <div className={styles.nav}>
          <h1 className={styles.label} />
          <div />
          <span className={styles.caption} />
          <div />
          <a href="https://lusion.co/" target="_blank" rel="noreferrer">
            <div className={styles.button}>VISIT LUSION</div>
          </a>
          <div className={styles.buttonGray}>///</div>
        </div>
        <Scene style={{ borderRadius: 20 }} className={styles.canvas} />
      </div>
    </div>
  );
}
