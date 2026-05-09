"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "aist-theme";
const THEME_CHANGE_EVENT = "aist-theme-change";
const SERVER_SNAPSHOT = "system:light";

function readStored(): Theme {
  if (typeof window === "undefined") return "system";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : "system";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

function computeResolved(theme: Theme): ResolvedTheme {
  if (theme === "light") return "light";
  if (theme === "dark") return "dark";
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getSnapshot() {
  const theme = readStored();
  return `${theme}:${computeResolved(theme)}`;
}

function subscribeToTheme(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  const notify = () => {
    applyTheme(readStored());
    listener();
  };
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  window.addEventListener(THEME_CHANGE_EVENT, notify);
  window.addEventListener("storage", notify);
  mediaQuery.addEventListener("change", notify);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, notify);
    window.removeEventListener("storage", notify);
    mediaQuery.removeEventListener("change", notify);
  };
}

export function useTheme() {
  const snapshot = useSyncExternalStore(
    subscribeToTheme,
    getSnapshot,
    () => SERVER_SNAPSHOT,
  );
  const [theme, resolved] = snapshot.split(":") as [Theme, ResolvedTheme];

  const setTheme = useCallback((t: Theme) => {
    if (t === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, t);
    }
    applyTheme(t);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  return { theme, resolved, setTheme, mounted: true };
}
