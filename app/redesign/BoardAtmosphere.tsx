import styles from "./redesign.module.css";

/** Soft animated color wash behind glass cards — page bg stays white/dark. */
export default function BoardAtmosphere() {
  return (
    <div className={styles.pageAtmosphere} aria-hidden>
      {/* data-decor: these drift forever, so they hold still once the section is away */}
      <span className={styles.pageAtmosphereBlob} data-blob="a" data-decor />
      <span className={styles.pageAtmosphereBlob} data-blob="b" data-decor />
      <span className={styles.pageAtmosphereBlob} data-blob="c" data-decor />
    </div>
  );
}
