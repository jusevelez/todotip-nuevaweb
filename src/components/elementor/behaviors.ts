type Cleanup = () => void;
type Settings = Record<string, unknown>;

const SPACER = "elementor-sticky__spacer";

function settingsOf(el: Element, attr = "data-settings"): Settings {
  try {
    return JSON.parse(el.getAttribute(attr) || "{}");
  } catch {
    return {};
  }
}

function device(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  return w <= 767 ? "mobile" : w <= 1024 ? "tablet" : "desktop";
}

function listen<K extends keyof WindowEventMap>(target: Window, type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions): Cleanup;
function listen(target: EventTarget, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions): Cleanup;
function listen(target: EventTarget, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions): Cleanup {
  target.addEventListener(type, fn, opts);
  return () => target.removeEventListener(type, fn, opts);
}

function all<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return [...root.querySelectorAll<T>(selector)].filter((el) => !el.closest(`.${SPACER}`));
}

function combine(cleanups: Cleanup[]): Cleanup {
  return () => cleanups.forEach((c) => c());
}

function deviceValue<T>(s: Settings, key: string): T | undefined {
  const d = device();
  if (d !== "desktop" && s[`${key}_${d}`] !== undefined && s[`${key}_${d}`] !== "") return s[`${key}_${d}`] as T;
  return s[key] as T | undefined;
}

// ---------------------------------------------------------------- body classes
export function initBodyClasses(): Cleanup {
  const ua = navigator.userAgent;
  const classes: string[] = [];
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) classes.push("e--ua-isTouchDevice");
  if (/Firefox\//.test(ua)) classes.push("e--ua-firefox");
  else if (/Edg\//.test(ua)) classes.push("e--ua-edge", "e--ua-blink", "e--ua-webkit");
  else if (/Chrome\//.test(ua)) classes.push("e--ua-blink", "e--ua-chrome", "e--ua-webkit");
  else if (/Safari\//.test(ua)) classes.push("e--ua-safari", "e--ua-webkit");
  classes.push("dialog-body", "dialog-lightbox-body", "dialog-container", "dialog-lightbox-container");
  document.body.classList.add(...classes);
  return () => document.body.classList.remove(...classes);
}

// ------------------------------------------------- Elementor lazy backgrounds
export function initLazyBackgrounds(): Cleanup {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("e-lazyloaded");
          io.unobserve(entry.target);
        }
      }),
    { rootMargin: "200px 0px 200px 0px" },
  );
  all(".e-con.e-parent:not(.e-lazyloaded)").forEach((el) => io.observe(el));
  return () => io.disconnect();
}

// ------------------------------------------- background slideshow (fade, Swiper-like)
export function initBackgroundSlideshows(): Cleanup {
  const cleanups: Cleanup[] = [];
  for (const el of all("[data-settings]")) {
    const s = settingsOf(el);
    if (s.background_background !== "slideshow" || !Array.isArray(s.background_slideshow_gallery)) continue;
    const urls = (s.background_slideshow_gallery as { url: string }[]).map((g) => {
      const u = new URL(g.url, location.origin);
      return u.hostname.endsWith("todoip.com") ? u.pathname : u.href;
    });
    if (!urls.length) continue;
    const slideMs = Number(s.background_slideshow_slide_duration ?? 5000);
    const fadeMs = Number(s.background_slideshow_transition_duration ?? 500);
    const loop = s.background_slideshow_loop === "yes";
    const root = document.createElement("div");
    root.className = "elementor-background-slideshow swiper swiper-fade swiper-initialized swiper-horizontal";
    root.dir = "ltr";
    const wrapper = document.createElement("div");
    wrapper.className = "swiper-wrapper";
    Object.assign(wrapper.style, { position: "relative", width: "100%", height: "100%" });
    const slides = urls.map((url, i) => {
      const slide = document.createElement("div");
      slide.className = "elementor-background-slideshow__slide swiper-slide";
      Object.assign(slide.style, { position: "absolute", inset: "0", opacity: i === 0 ? "1" : "0", transition: `opacity ${fadeMs}ms` });
      const img = document.createElement("div");
      img.className = "elementor-background-slideshow__slide__image";
      img.style.backgroundImage = `url("${url}")`;
      slide.appendChild(img);
      wrapper.appendChild(slide);
      return slide;
    });
    root.appendChild(wrapper);
    el.prepend(root);
    let current = 0;
    const timer = window.setInterval(() => {
      if (!loop && current === slides.length - 1) return window.clearInterval(timer);
      slides[current].style.opacity = "0";
      current = (current + 1) % slides.length;
      slides[current].style.opacity = "1";
    }, slideMs + fadeMs);
    cleanups.push(() => {
      window.clearInterval(timer);
      root.remove();
    });
  }
  return combine(cleanups);
}

// ------------------------------------------------------ entrance animations
export function initEntranceAnimations(): Cleanup {
  const timers: number[] = [];
  const io = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      io.unobserve(el);
      const s = settingsOf(el);
      const animation = deviceValue<string>(s, "_animation") ?? deviceValue<string>(s, "animation");
      if (!animation || animation === "none") {
        el.classList.remove("elementor-invisible");
        return;
      }
      const delay = Number(s._animation_delay ?? s.animation_delay ?? 0);
      timers.push(
        window.setTimeout(() => {
          el.classList.remove("elementor-invisible");
          el.classList.add("animated", animation);
        }, delay),
      );
    }),
  );
  all(".elementor-invisible").forEach((el) => io.observe(el));
  return () => {
    io.disconnect();
    timers.forEach(clearTimeout);
  };
}

// ------------------------------------------------------------------- sticky
type StickyState = { el: HTMLElement; s: Settings; spacer: HTMLElement | null };

export function initSticky(): Cleanup {
  const states: StickyState[] = all("[data-settings]")
    .filter((el) => settingsOf(el).sticky === "top")
    .map((el) => ({ el, s: settingsOf(el), spacer: null }));
  if (!states.length) return () => {};
  states.forEach((st) => st.el.classList.add("elementor-sticky"));

  const activate = (st: StickyState, offset: number) => {
    const width = st.el.getBoundingClientRect().width;
    const spacer = st.el.cloneNode(true) as HTMLElement;
    spacer.classList.add(SPACER);
    spacer.removeAttribute("id");
    spacer.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    spacer.setAttribute("aria-hidden", "true");
    spacer.style.visibility = "hidden";
    spacer.style.transition = "none";
    spacer.style.animation = "none";
    st.el.after(spacer);
    st.spacer = spacer;
    Object.assign(st.el.style, { position: "fixed", width: `${width}px`, marginTop: "0px", marginBottom: "0px", top: `${offset}px` });
    st.el.classList.add("elementor-sticky--active", "elementor-section--handles-inside");
  };
  const deactivate = (st: StickyState) => {
    if (!st.spacer) return;
    st.spacer.remove();
    st.spacer = null;
    for (const p of ["position", "width", "margin-top", "margin-bottom", "top"]) st.el.style.removeProperty(p);
    st.el.classList.remove("elementor-sticky--active", "elementor-section--handles-inside", "elementor-sticky--effects");
  };
  const update = () => {
    const dev = device();
    for (const st of states) {
      const devices = (st.s.sticky_on as string[] | undefined) ?? ["desktop", "tablet", "mobile"];
      const offset = Number(st.s.sticky_offset ?? 0);
      const ref = st.spacer ?? st.el;
      const visible = ref.getClientRects().length > 0;
      if (!devices.includes(dev) || !visible) {
        deactivate(st);
        continue;
      }
      const top = ref.getBoundingClientRect().top;
      if (top <= offset && !st.spacer) activate(st, offset);
      else if (top > offset && st.spacer) deactivate(st);
      if (st.spacer) {
        st.el.style.width = `${st.spacer.getBoundingClientRect().width}px`;
        if (st.s.sticky_parent === "yes" && st.spacer.parentElement) {
          const bottom = st.spacer.parentElement.getBoundingClientRect().bottom;
          st.el.style.top = `${Math.min(offset, bottom - st.el.offsetHeight)}px`;
        }
        st.el.classList.toggle("elementor-sticky--effects", window.scrollY >= Number(st.s.sticky_effects_offset ?? 0));
      }
    }
  };
  update();
  const c = [listen(window, "scroll", update, { passive: true }), listen(window, "resize", update)];
  return () => {
    c.forEach((f) => f());
    states.forEach((st) => {
      deactivate(st);
      st.el.classList.remove("elementor-sticky");
    });
  };
}

// --------------------------------------------------------------- motion fx
function viewportPercentage(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const pct = Math.max(0, Math.min((vh - r.top) / (vh + el.offsetHeight), 1));
  return +(pct * 100).toFixed(2);
}

export function initMotionFx(): Cleanup {
  type Fx = { el: HTMLElement; bg: boolean; speed: number; start: number; end: number; devices: string[]; layer?: HTMLElement; container?: HTMLElement };
  const items: Fx[] = [];
  for (const el of all("[data-settings]")) {
    const s = settingsOf(el);
    for (const prefix of ["motion_fx_", "background_motion_fx_"]) {
      if (s[`${prefix}motion_fx_scrolling`] !== "yes" || s[`${prefix}translateY_effect`] !== "yes") continue;
      const range = (s[`${prefix}translateY_affectedRange`] as { sizes?: { start?: number; end?: number } })?.sizes ?? {};
      items.push({
        el,
        bg: prefix === "background_motion_fx_",
        speed: Number((s[`${prefix}translateY_speed`] as { size?: number })?.size ?? 4),
        start: Number(range.start ?? 0),
        end: Number(range.end ?? 100),
        devices: (s[`${prefix}devices`] as string[]) ?? ["desktop", "tablet", "mobile"],
      });
    }
  }
  const setup = (fx: Fx) => {
    if (fx.bg) {
      // Background parallax: Elementor Pro moves the background into a translated layer.
      const cs = getComputedStyle(fx.el);
      const container = document.createElement("div");
      container.className = "elementor-motion-effects-container";
      const layer = document.createElement("div");
      layer.className = "elementor-motion-effects-layer";
      Object.assign(layer.style, {
        backgroundImage: cs.backgroundImage,
        backgroundSize: cs.backgroundSize,
        backgroundPosition: cs.backgroundPosition,
        backgroundRepeat: cs.backgroundRepeat,
        width: "100%",
        height: `calc(100% + ${fx.speed * 10}px)`,
      });
      container.appendChild(layer);
      fx.el.prepend(container);
      fx.el.classList.add("elementor-motion-effects-element", "elementor-motion-effects-element-type-background");
      fx.container = container;
      fx.layer = layer;
    } else {
      fx.el.classList.add("elementor-motion-effects-element");
      fx.el.parentElement?.classList.add("elementor-motion-effects-parent");
      fx.el.style.setProperty("--e-transform-transition-duration", "100ms");
      fx.el.style.transform = "translateY(var(--translateY))";
    }
  };
  const teardown = (fx: Fx) => {
    fx.container?.remove();
    fx.container = fx.layer = undefined;
    fx.el.classList.remove("elementor-motion-effects-element", "elementor-motion-effects-element-type-background");
    fx.el.parentElement?.classList.remove("elementor-motion-effects-parent");
    for (const p of ["--translateY", "--e-transform-transition-duration", "transform"]) fx.el.style.removeProperty(p);
  };
  const active = new Set<Fx>();
  const run = () => {
    const dev = device();
    for (const fx of items) {
      const on = fx.devices.includes(dev);
      if (on && !active.has(fx)) {
        setup(fx);
        active.add(fx);
      } else if (!on && active.has(fx)) {
        teardown(fx);
        active.delete(fx);
      }
      if (!on) continue;
      const ref = fx.bg ? fx.el : (fx.el.parentElement ?? fx.el);
      const p = Math.min(Math.max(viewportPercentage(ref), fx.start), fx.end);
      if (fx.layer) fx.layer.style.transform = `translateY(${-(fx.speed * 10 * p) / 100}px)`;
      else fx.el.style.setProperty("--translateY", `${-(p - 50) * fx.speed}px`);
    }
  };
  let raf = 0;
  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(run);
  };
  run();
  const c = [listen(window, "scroll", onScroll, { passive: true }), listen(window, "resize", onScroll)];
  return () => {
    cancelAnimationFrame(raf);
    c.forEach((f) => f());
    active.forEach(teardown);
  };
}

// --------------------------------------------------- nested mega menu (n-menu)
export function initMegaMenus(): Cleanup {
  const cleanups: Cleanup[] = [];
  for (const nav of all("nav.e-n-menu")) {
    const widget = nav.closest(".elementor-widget-n-menu") as HTMLElement | null;
    const toggle = nav.querySelector<HTMLButtonElement>(".e-n-menu-toggle");
    const wrapper = nav.querySelector<HTMLElement>(".e-n-menu-wrapper");
    if (!widget || !wrapper) continue;
    const breakpoint = widget.classList.contains("e-n-menu-mobile") ? 767 : widget.classList.contains("e-n-menu-none") ? 0 : 1024;
    const isDropdown = () => window.innerWidth <= breakpoint;
    const items = [...nav.querySelectorAll<HTMLElement>(".e-n-menu-item")];

    // Elementor's CSS keys the dropdown (mobile/tablet) layout off these attributes.
    nav.dataset.touchMode = String("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const setLayout = () => {
      nav.dataset.layout = isDropdown() ? "dropdown" : "horizontal";
    };
    setLayout();
    const setStretch = () => {
      const rect = nav.getBoundingClientRect();
      wrapper.style.setProperty("--stretch-width", `${document.body.clientWidth}px`);
      wrapper.style.setProperty("--stretch-left", `${rect.width || rect.height ? -rect.left : 0}px`);
    };
    const parts = (item: HTMLElement) => {
      const btn = item.querySelector<HTMLButtonElement>(".e-n-menu-dropdown-icon");
      const contentWrap = item.querySelector<HTMLElement>(".e-n-menu-content");
      const content = btn ? document.getElementById(btn.getAttribute("aria-controls") || "") : null;
      return { btn, contentWrap, content };
    };
    const close = (item: HTMLElement) => {
      const { btn, contentWrap, content } = parts(item);
      if (!btn || btn.getAttribute("aria-expanded") !== "true") return;
      btn.setAttribute("aria-expanded", "false");
      contentWrap?.classList.remove("e-active");
      if (content) {
        content.classList.remove("animated", "e-active");
        content.style.display = "none";
        if (isDropdown()) {
          content.style.height = "initial";
          content.style.overflowY = "visible";
        }
      }
    };
    const open = (item: HTMLElement) => {
      const { btn, contentWrap, content } = parts(item);
      if (!btn) return;
      items.forEach((i) => i !== item && close(i));
      btn.setAttribute("aria-expanded", "true");
      contentWrap?.classList.add("e-active");
      if (content) {
        content.classList.add("animated", "e-active");
        content.style.display = "var(--display)";
        content.style.position = "var(--position)";
        content.style.width = "var(--width)";
      }
      setStretch();
    };
    const isOpen = (item: HTMLElement) => parts(item).btn?.getAttribute("aria-expanded") === "true";
    const closeAll = () => items.forEach(close);

    setStretch();
    for (const item of items) {
      const { btn } = parts(item);
      if (!btn) continue;
      const title = item.querySelector<HTMLElement>(".e-n-menu-title");
      const clickOnly = title?.classList.contains("e-click");
      cleanups.push(
        listen(item, "mouseenter", () => {
          if (!isDropdown() && !clickOnly) open(item);
        }),
        listen(item, "mouseleave", () => {
          if (!isDropdown() && !clickOnly) close(item);
        }),
        listen(btn, "click", (e) => {
          e.preventDefault();
          if (isOpen(item)) close(item);
          else open(item);
        }),
      );
      const container = title?.querySelector(".e-n-menu-title-container:not(a)");
      if (container)
        cleanups.push(
          listen(container, "click", () => {
            if (isDropdown() || clickOnly) {
              if (isOpen(item)) close(item);
              else open(item);
            }
          }),
        );
    }
    if (toggle) {
      cleanups.push(
        listen(toggle, "click", () => {
          const expanded = toggle.getAttribute("aria-expanded") === "true";
          toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
          if (expanded) {
            closeAll();
            wrapper.style.setProperty("--n-menu-dropdown-content-box-height", "0");
            wrapper.style.setProperty("--stretch-left", "0px");
          } else {
            setStretch();
            const top = wrapper.getBoundingClientRect().top;
            wrapper.style.setProperty("--n-menu-dropdown-content-box-height", `${window.innerHeight - top}px`);
          }
        }),
      );
    }
    cleanups.push(
      listen(document, "click", (e) => {
        if (!isDropdown() && !nav.contains(e.target as Node)) closeAll();
      }),
      listen(document, "keydown", (e) => {
        if ((e as KeyboardEvent).key === "Escape") closeAll();
      }),
      listen(window, "resize", () => {
        setLayout();
        if (toggle?.getAttribute("aria-expanded") !== "true") setStretch();
      }),
    );
  }
  return combine(cleanups);
}

// ------------------------------------------------------------- nested tabs
export function initNestedTabs(): Cleanup {
  const cleanups: Cleanup[] = [];
  for (const tabs of all(".e-n-tabs")) {
    const titles = [...tabs.querySelectorAll<HTMLElement>(":scope > .e-n-tabs-heading > .e-n-tab-title")];
    // Without .e-activated, Elementor's CSS keeps the first panel visible (no-JS fallback).
    tabs.classList.add("e-activated");
    tabs.dataset.touchMode = String("ontouchstart" in window || navigator.maxTouchPoints > 0);
    cleanups.push(() => tabs.classList.remove("e-activated"));
    const select = (t: HTMLElement) => {
      for (const other of titles) {
        const selected = other === t;
        other.setAttribute("aria-selected", String(selected));
        other.setAttribute("tabindex", selected ? "0" : "-1");
        document.getElementById(other.getAttribute("aria-controls") || "")?.classList.toggle("e-active", selected);
      }
    };
    titles.forEach((t, i) => {
      cleanups.push(
        listen(t, "click", () => select(t)),
        listen(t, "keydown", (e) => {
          const k = (e as KeyboardEvent).key;
          const d = k === "ArrowRight" || k === "ArrowDown" ? 1 : k === "ArrowLeft" || k === "ArrowUp" ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          const next = titles[(i + d + titles.length) % titles.length];
          next.focus();
          select(next);
        }),
      );
    });
  }
  return combine(cleanups);
}

// ----------------------------------------------------------------- counters
export function initCounters(): Cleanup {
  const frames: number[] = [];
  const io = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      io.unobserve(el);
      const from = Number(el.dataset.fromValue ?? 0);
      const to = Number(el.dataset.toValue ?? 0);
      const duration = Number(el.dataset.duration ?? 2000);
      const delimiter = el.dataset.delimiter ?? "";
      const decimals = (String(el.dataset.toValue).split(".")[1] || "").length;
      const fmt = (n: number) => {
        const [i, d] = n.toFixed(decimals).split(".");
        const withDelim = delimiter ? i.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter) : i;
        return d ? `${withDelim}.${d}` : withDelim;
      };
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        el.textContent = fmt(from + (to - from) * p);
        if (p < 1) frames.push(requestAnimationFrame(step));
      };
      frames.push(requestAnimationFrame(step));
    }),
  );
  all(".elementor-counter-number").forEach((el) => io.observe(el));
  return () => {
    io.disconnect();
    frames.forEach(cancelAnimationFrame);
  };
}

// ------------------------------------------------- animated headline (rotate)
export function initAnimatedHeadlines(): Cleanup {
  const timers: number[] = [];
  const restore: Array<() => void> = [];
  for (const widget of all(".elementor-widget-animated-headline")) {
    const s = settingsOf(widget);
    if (s.headline_style !== "rotate") continue;
    const headline = widget.querySelector<HTMLElement>(".elementor-headline");
    const wrapper = widget.querySelector<HTMLElement>(".elementor-headline-dynamic-wrapper");
    if (!headline || !wrapper) continue;
    const words = [...wrapper.querySelectorAll<HTMLElement>(".elementor-headline-dynamic-text")];
    if (words.length < 2) continue;
    const letters = headline.classList.contains("elementor-headline-letters");
    const delay = Number(s.rotate_iteration_delay ?? 2500);
    const lettersDelay = 50;
    const originals = words.map((w) => w.innerHTML);
    restore.push(() =>
      words.forEach((w, i) => {
        w.innerHTML = originals[i];
        w.style.opacity = "";
      }),
    );

    if (letters) {
      words.forEach((w) => {
        const text = (w.textContent || "").trim();
        const active = w.classList.contains("elementor-headline-text-active");
        w.innerHTML = [...text]
          .map((ch) => `<span class="elementor-headline-dynamic-letter${active ? " elementor-headline-animation-in" : ""}">${ch === " " ? "&nbsp;" : ch}</span>`)
          .join("");
        w.style.opacity = "1";
      });
    }
    const setWidth = (w: HTMLElement) => {
      wrapper.style.width = `${w.offsetWidth}px`;
    };
    const next = (w: HTMLElement) => words[(words.indexOf(w) + 1) % words.length];
    const switchWord = (oldW: HTMLElement, newW: HTMLElement) => {
      oldW.classList.remove("elementor-headline-text-active");
      oldW.classList.add("elementor-headline-text-inactive");
      newW.classList.remove("elementor-headline-text-inactive");
      newW.classList.add("elementor-headline-text-active");
      setWidth(newW);
    };
    const hideLetter = (l: Element, word: HTMLElement, bool: boolean) => {
      l.classList.remove("elementor-headline-animation-in");
      l.classList.add("elementor-headline-animation-out");
      if (l.nextElementSibling) timers.push(window.setTimeout(() => hideLetter(l.nextElementSibling!, word, bool), lettersDelay));
      else if (bool) timers.push(window.setTimeout(() => hideWord(next(word)), delay));
    };
    const showLetter = (l: Element, word: HTMLElement, bool: boolean) => {
      l.classList.add("elementor-headline-animation-in");
      l.classList.remove("elementor-headline-animation-out");
      if (l.nextElementSibling) timers.push(window.setTimeout(() => showLetter(l.nextElementSibling!, word, bool), lettersDelay));
      else if (!bool) timers.push(window.setTimeout(() => hideWord(word), delay));
    };
    const hideWord = (word: HTMLElement) => {
      const nw = next(word);
      if (letters) {
        const bool = word.children.length >= nw.children.length;
        if (word.firstElementChild) hideLetter(word.firstElementChild, word, bool);
        if (nw.firstElementChild) showLetter(nw.firstElementChild, nw, bool);
        setWidth(nw);
      } else timers.push(window.setTimeout(() => hideWord(nw), delay));
      switchWord(word, nw);
    };
    const active = words.find((w) => w.classList.contains("elementor-headline-text-active")) ?? words[0];
    words.forEach((w) => w !== active && w.classList.add("elementor-headline-text-inactive"));
    setWidth(active);
    timers.push(window.setTimeout(() => hideWord(active), delay));
  }
  return () => {
    timers.forEach(clearTimeout);
    restore.forEach((r) => r());
  };
}

// ------------------------------------------------------------------ popups
const CLOSE_ICON =
  '<svg class="e-font-icon-svg e-eicon-close eicon-close" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z"></path></svg>';

export function initPopups(): Cleanup {
  const cleanups: Cleanup[] = [];
  const dialogs: HTMLElement[] = [];
  for (const popup of all('[data-elementor-type="popup"]')) {
    const s = settingsOf(popup, "data-elementor-settings");
    const id = popup.getAttribute("data-elementor-id");
    const triggers = (Array.isArray(s.triggers) ? {} : s.triggers) as Settings;
    const timing = (Array.isArray(s.timing) ? {} : s.timing) as Settings;
    let shown = false;
    const open = () => {
      if (shown) return;
      shown = true;
      const modal = document.createElement("div");
      modal.className = `dialog-widget dialog-lightbox-widget dialog-type-buttons dialog-type-lightbox elementor-popup-modal ${s.classes ?? ""}`.trim();
      modal.id = `elementor-popup-modal-${id}`;
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("role", "document");
      modal.tabIndex = 0;
      modal.innerHTML = `<div class="dialog-widget-content dialog-lightbox-widget-content animated"><a role="button" tabindex="0" aria-label="Close" href="#" class="dialog-close-button dialog-lightbox-close-button">${CLOSE_ICON}</a><div class="dialog-header dialog-lightbox-header"></div><div class="dialog-message dialog-lightbox-message"></div><div class="dialog-buttons-wrapper dialog-lightbox-buttons-wrapper"></div></div>`;
      const clone = popup.cloneNode(true) as HTMLElement;
      clone.style.display = "block";
      modal.querySelector(".dialog-message")!.appendChild(clone);
      modal.style.display = "flex";
      document.body.appendChild(modal);
      dialogs.push(modal);
      const close = () => modal.remove();
      modal.querySelector(".dialog-close-button")!.addEventListener("click", (e) => {
        e.preventDefault();
        close();
      });
      modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
      });
    };
    if (timing.devices === "yes" && !((timing.devices_devices as string[]) ?? []).includes(device())) continue;
    if (triggers.scrolling === "yes") {
      const offset = Number(triggers.scrolling_offset ?? 10);
      const direction = triggers.scrolling_direction ?? "down";
      let last = window.scrollY;
      cleanups.push(
        listen(
          window,
          "scroll",
          () => {
            const y = window.scrollY;
            const goingDown = y > last;
            last = y;
            if (direction === "down" && !goingDown) return;
            if (direction === "up" && goingDown) return;
            const pct = (y / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (pct >= offset) open();
          },
          { passive: true },
        ),
      );
    }
    if (typeof s.open_selector === "string" && s.open_selector)
      cleanups.push(
        listen(document, "click", (e) => {
          if ((e.target as Element)?.closest?.(s.open_selector as string)) {
            e.preventDefault();
            open();
          }
        }),
      );
  }
  return () => {
    cleanups.forEach((c) => c());
    dialogs.forEach((d) => d.remove());
  };
}

// ------------------------------------------------------------------- videos
function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function initVideos(): Cleanup {
  const created: HTMLElement[] = [];
  const hidden: HTMLElement[] = [];
  const cleanups: Cleanup[] = [];
  for (const widget of all(".elementor-widget-video")) {
    const s = settingsOf(widget);
    if (s.video_type !== "youtube") continue;
    const id = youtubeId(String(s.youtube_url ?? ""));
    const target = widget.querySelector<HTMLElement>(".elementor-video");
    if (!id || !target) continue;
    const mount = (autoplay: boolean) => {
      const params = new URLSearchParams({
        controls: s.controls === "yes" ? "1" : "0",
        rel: "0",
        playsinline: "0",
        cc_load_policy: "0",
        autoplay: autoplay ? "1" : "0",
      });
      const iframe = document.createElement("iframe");
      iframe.className = "elementor-video";
      iframe.src = `https://www.youtube.com/embed/${id}?${params}`;
      iframe.title = "YouTube video player";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      iframe.allowFullscreen = true;
      iframe.width = "640";
      iframe.height = "360";
      target.style.display = "none";
      hidden.push(target);
      target.after(iframe);
      created.push(iframe);
    };
    const overlay = widget.querySelector<HTMLElement>(".elementor-custom-embed-image-overlay");
    if (s.show_image_overlay === "yes" && overlay) {
      const onClick = () => {
        overlay.style.display = "none";
        hidden.push(overlay);
        mount(true);
      };
      cleanups.push(listen(overlay, "click", onClick, { once: true }));
    } else mount(false);
  }
  return () => {
    cleanups.forEach((c) => c());
    created.forEach((n) => n.remove());
    hidden.forEach((n) => n.style.removeProperty("display"));
  };
}

// ----------------------------------------------- Egeiro WhatsApp FAB plugin
export function initFab(): Cleanup {
  const button = document.getElementById("egeiro-whfab-button");
  const menu = document.getElementById("egeiro-whfab-menu");
  if (!button || !menu) return () => {};
  const setOpen = (open: boolean) => {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    button.setAttribute("aria-expanded", String(open));
  };
  return combine([
    listen(button, "click", (e) => {
      e.stopPropagation();
      setOpen(!menu.classList.contains("is-open"));
    }),
    listen(document, "click", (e) => {
      if (!button.contains(e.target as Node) && !menu.contains(e.target as Node)) setOpen(false);
    }),
    listen(document, "keydown", (e) => {
      if ((e as KeyboardEvent).key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        button.focus();
      }
    }),
  ]);
}

// ------------------------------------------------- products-addon plugin
export function initProductsCatalog(): Cleanup {
  const cleanups: Cleanup[] = [];
  for (const card of all(".pa-product-card")) {
    cleanups.push(
      listen(card, "mouseenter", () => card.classList.add("is-hovered")),
      listen(card, "mouseleave", () => card.classList.remove("is-hovered")),
    );
  }
  for (const cta of all<HTMLAnchorElement>(".pa-cta-button")) {
    cleanups.push(
      listen(cta, "click", (e) => {
        const href = cta.getAttribute("href");
        if (!href?.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      }),
    );
  }
  return combine(cleanups);
}

// ------------------------------- inline script from the home page HTML widget
export function initHomeFormTweaks(): Cleanup {
  for (const form of all(".dd-ele-form")) {
    for (const select of form.querySelectorAll<HTMLSelectElement>("select[required]")) {
      const first = select.options[0];
      if (first && first.value.trim() === "") {
        first.disabled = true;
        first.hidden = true;
      }
    }
  }
  return () => {};
}
