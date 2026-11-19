"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { installFormGuard } from "./forms";
import {
  initAnimatedHeadlines,
  initBodyClasses,
  initCounters,
  initEmoji,
  initEntranceAnimations,
  initFab,
  initHomeFormTweaks,
  initLazyBackgrounds,
  initBackgroundSlideshows,
  initMegaMenus,
  initMotionFx,
  initNestedTabs,
  initPopups,
  initProductsCatalog,
  initSticky,
  initVideos,
} from "./behaviors";

/**
 * Re-implements, without jQuery/WordPress, the front-end behaviour that
 * Elementor, Elementor Pro and the site plugins add on top of the server HTML
 * (sticky header, mega menu, entrance animations, motion effects, lazy
 * backgrounds, tabs, counters, animated headline, popups, videos, WhatsApp FAB,
 * WordPress emoji fallback).
 */
export default function ElementorRuntime() {
  const pathname = usePathname();
  useEffect(() => {
    const cleanups = [
      initBodyClasses(),
      initLazyBackgrounds(),
      initBackgroundSlideshows(),
      initEntranceAnimations(),
      initMegaMenus(),
      initSticky(),
      initMotionFx(),
      initNestedTabs(),
      initCounters(),
      initAnimatedHeadlines(),
      initPopups(),
      initVideos(),
      initFab(),
      initProductsCatalog(),
      initHomeFormTweaks(),
      installFormGuard(),
      initEmoji(),
    ];
    return () => cleanups.forEach((c) => c?.());
  }, [pathname]);
  return null;
}
