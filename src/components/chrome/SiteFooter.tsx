import FooterLegalLinks from "@/components/wp/FooterLegalLinks";
import {
  CALENDAR_CITA,
  FOOTER_IA,
  FOOTER_IA_EXTRA,
  FOOTER_TELEFONIA,
  LOGO_BLANCO,
  SOCIAL,
  WHATSAPP_FOOTER_CONTACT,
  WHATSAPP_FOOTER_TOP,
  type NavLink,
} from "./links";
import styles from "./footer.module.css";

function FooterNav({ title, links, path }: { title: string; links: readonly NavLink[]; path: string }) {
  return (
    <div>
      <p className={styles.heading}>{title}</p>
      <ul className={styles.list}>
        {links.map((link) => {
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
    </div>
  );
}

export default function SiteFooter({ path }: { path: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.ctaRow}>
        <a className={styles.waTop} href={WHATSAPP_FOOTER_TOP} target="_blank" rel="noreferrer">
          3009122820
        </a>
        <a className={styles.calendar} href={CALENDAR_CITA} target="_blank" rel="noreferrer">
          Agenda una cita con nuestros comerciales
        </a>
      </div>

      <div className={styles.grid}>
        <div>
          <img className={styles.logo} src={LOGO_BLANCO} width={160} height={65} alt="Logotipo de TodoIP en blanco" />
        </div>
        <FooterNav title="Soluciones de Telefonía" links={FOOTER_TELEFONIA} path={path} />
        <div>
          <FooterNav title="Soluciones de Inteligencia Artificial" links={FOOTER_IA} path={path} />
          <ul className={styles.list}>
            {FOOTER_IA_EXTRA.map((link) => {
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
        </div>
        <div>
          <p className={styles.heading}>Contacto</p>
          <ul className={styles.contact}>
            <li>
              <a href={WHATSAPP_FOOTER_CONTACT} target="_blank" rel="noreferrer">
                <b>WhatsApp: </b>3009122820
              </a>
            </li>
            <li>
              <a href="tel:6025244008">
                <b>Línea Local:</b> 602 524 4008
              </a>
            </li>
            <li>
              <a href="mailto:info@todoip.com" target="_blank" rel="nofollow">
                info@todoip.com
              </a>
            </li>
            <li>
              <a href="/referidos/" aria-current={path === "/referidos/" ? "page" : undefined}>
                Conoce nuestro <b>Plan de Referidos</b>
              </a>
            </li>
          </ul>
          <ul className={styles.social}>
            {SOCIAL.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <FooterLegalLinks path={path} />
    </footer>
  );
}
