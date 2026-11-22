import { LEGAL_LINKS } from "@/components/chrome/links";
import styles from "./footer-legal-links.module.css";

/**
 * Legal links in the shared footer. Lives outside src/generated/wp
 * so scripts/generate/generate.mjs can re-emit wrappers around this bar.
 */
export default function FooterLegalLinks({ path }: { path: string }) {
  return (
    <nav className={styles.nav} aria-label="Enlaces legales">
      <ul className={styles.list}>
        {LEGAL_LINKS.map((link) => {
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
