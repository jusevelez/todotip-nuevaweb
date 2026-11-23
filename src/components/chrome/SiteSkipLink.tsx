import styles from "./skip-link.module.css";

export default function SiteSkipLink({ path }: { path: string }) {
  void path;
  return (
    <a className={styles.link} href="#content">
      Ir al contenido
    </a>
  );
}
