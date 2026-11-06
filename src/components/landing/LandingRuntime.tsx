"use client";

import { useEffect } from "react";
import { installFormGuard } from "@/components/elementor/forms";

// Port of the inline script shipped with the static landings (WhatsApp widget:
// toggle panel, close on outside click, hide while the footer is visible).
export default function LandingRuntime() {
  useEffect(() => {
    const cleanups: Array<() => void> = [installFormGuard()];
    const widget = document.querySelector<HTMLElement>(".wa-widget");
    if (widget) {
      const fab = widget.querySelector(".wa-fab");
      const close = widget.querySelector(".wa-panel__close");
      const onFab = () => widget.classList.toggle("open");
      const onClose = (e: Event) => {
        e.stopPropagation();
        widget.classList.remove("open");
      };
      const onDoc = (e: MouseEvent) => {
        if (!widget.contains(e.target as Node)) widget.classList.remove("open");
      };
      fab?.addEventListener("click", onFab);
      close?.addEventListener("click", onClose);
      document.addEventListener("click", onDoc);
      const footer = document.querySelector("footer.site-footer");
      let io: IntersectionObserver | undefined;
      if (footer && "IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                widget.classList.add("wa-widget--hidden");
                widget.classList.remove("open");
              } else widget.classList.remove("wa-widget--hidden");
            }),
          { threshold: 0.1 },
        );
        io.observe(footer);
      }
      cleanups.push(() => {
        fab?.removeEventListener("click", onFab);
        close?.removeEventListener("click", onClose);
        document.removeEventListener("click", onDoc);
        io?.disconnect();
      });
    }
    return () => cleanups.forEach((c) => c());
  }, []);
  return null;
}
