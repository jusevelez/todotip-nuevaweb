import styles from "./footer-legal-links.module.css";

/**
 * Legal links in the shared Elementor footer. Lives outside src/generated/wp
 * so scripts/generate/generate.mjs can re-emit Footer988867 around this bar.
 */
const LINKS = [
  { href: "/aviso-de-privacidad/", label: "Aviso de privacidad" },
  { href: "/softphone/condiciones/", label: "Condiciones de uso del Softphone" },
  { href: "/softphone/privacidad/", label: "Política de privacidad del Softphone" },
] as const;

export default function FooterLegalLinks({ path }: { path: string }) {
  return (
    <nav className={styles.nav} aria-label="Enlaces legales">
      <ul className={styles.list}>
        {LINKS.map((link) => {
          const active = path === link.href;
          return (
            <li key={link.href}>
              <a href={link.href} aria-current={active ? "page" : undefined}>
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
