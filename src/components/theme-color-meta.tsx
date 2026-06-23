"use client";

import { useEffect } from "react";

function updateThemeColor() {
  const isDark = document.documentElement.classList.contains("dark");
  const color = isDark ? "#1c1917" : "#fafaf9";
  let tag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "theme-color";
    document.head.appendChild(tag);
  }
  tag.content = color;
}

export function ThemeColorMeta() {
  useEffect(() => {
    updateThemeColor();

    // Watch for class changes on <html> so we catch the theme toggle immediately.
    const observer = new MutationObserver(updateThemeColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return null;
}
