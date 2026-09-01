"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type Theme = "system" | "light" | "dark";

export const THEME_KEY = "todo-app:theme";
const THEME_EVENT = "todo-app:theme-change";

function isTheme(value: unknown): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

function getSnapshot(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function getServerSnapshot(): Theme {
  return "system";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // layout の先読みスクリプトと同じルールで data-theme を反映する
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // 保存できない環境では切り替えを諦める（OS 設定に従う）
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return { theme, setTheme };
}
