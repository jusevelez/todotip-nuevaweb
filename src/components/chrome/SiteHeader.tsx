"use client";

import { useEffect, useId, useState } from "react";
import {
  LOGO_COLOR,
  PRODUCTS_IA,
  PRODUCTS_VOZ,
  WHATSAPP_HEADER,
  type ProductLink,
} from "./links";
import styles from "./header.module.css";

function isActive(path: string, href: string) {
  return path === href;
}

function ProductCard({ item, path, onNavigate }: { item: ProductLink; path: string; onNavigate: () => void }) {
  const active = isActive(path, item.href);
  return (
    <a className={styles.product} href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate}>
      <span className={styles.productTitle}>
        {item.icon} {item.label}
      </span>
      <span className={styles.productDesc}>{item.description}</span>
    </a>
  );
}

export default function SiteHeader({ path }: { path: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const menuId = useId();
  const productsId = useId();

  useEffect(() => {
    setMenuOpen(false);
    setProductsOpen(false);
  }, [path]);

  useEffect(() => {
    if (!menuOpen && !productsOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setProductsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, productsOpen]);

  const close = () => {
    setMenuOpen(false);
    setProductsOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a className={styles.logo} href="/" onClick={close}>
          <img src={LOGO_COLOR} width={140} height={57} alt="Logotipo de TodoIP" />
        </a>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} id={menuId} aria-label="Menú principal">
          <a className={styles.item} href="/" aria-current={path === "/" ? "page" : undefined} onClick={close}>
            Inicio
          </a>

          <div className={`${styles.products} ${productsOpen ? styles.productsOpen : ""}`}>
            <button
              type="button"
              className={styles.itemButton}
              aria-expanded={productsOpen}
              aria-controls={productsId}
              onClick={() => setProductsOpen((open) => !open)}
            >
              Productos
              <span className={styles.caret} aria-hidden="true" />
            </button>
            <div className={styles.mega} id={productsId}>
              <div>
                <p className={styles.megaKicker}>Inteligencia artificial</p>
                <p className={styles.megaSub}>(Soluciones que piensan, aprenden y ejecutan)</p>
                {PRODUCTS_IA.map((item) => (
                  <ProductCard key={item.href} item={item} path={path} onNavigate={close} />
                ))}
              </div>
              <div>
                <p className={styles.megaKicker}>Comunicación de voz</p>
                <p className={styles.megaSub}>(Infraestructura y conectividad empresarial)</p>
                {PRODUCTS_VOZ.map((item) => (
                  <ProductCard key={item.href} item={item} path={path} onNavigate={close} />
                ))}
              </div>
            </div>
          </div>

          <a className={styles.item} href="/blog/" aria-current={isActive(path, "/blog/") ? "page" : undefined} onClick={close}>
            Nuestro blog
          </a>
          <a
            className={styles.item}
            href="/reportes-telefonia/"
            aria-current={isActive(path, "/reportes-telefonia/") ? "page" : undefined}
            onClick={close}
          >
            Acceso Clientes
          </a>
        </nav>

        <div className={styles.actions}>
          <a className={`${styles.ghost} ${styles.desktopOnly}`} href={WHATSAPP_HEADER}>
            3009122820
          </a>
          <a className={`${styles.cta} ${styles.desktopOnly}`} href="/#form">
            Contáctanos
          </a>
          <a className={`${styles.cta} ${styles.mobileOnly}`} href="/#form-mobie">
            Contáctanos
          </a>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
