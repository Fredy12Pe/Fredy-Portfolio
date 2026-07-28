import styles from "./redesign.module.css";

/** Soft animated color wash behind glass cards — page bg stays white/dark. */
export default function BoardAtmosphere() {
  return (
    <div className={styles.pageAtmosphere} aria-hidden>
      <span className={styles.pageAtmosphereBlob} data-blob="a" />
      <span className={styles.pageAtmosphereBlob} data-blob="b" />
      <span className={styles.pageAtmosphereBlob} data-blob="c" />
    </div>
  );
}
