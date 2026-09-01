"use client";

import { useTheme, type Theme } from "@/hooks/use-theme";
import { MonitorIcon, MoonIcon, SunIcon } from "./icons";

const OPTIONS: { value: Theme; label: string; Icon: typeof SunIcon }[] = [
  { value: "system", label: "OS の設定に合わせる", Icon: MonitorIcon },
  { value: "light", label: "ライトモード", Icon: SunIcon },
  { value: "dark", label: "ダークモード", Icon: MoonIcon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="配色"
      className="flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={`rounded-full p-1.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
              active
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            }`}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
