"use client";

import { useEffect, useRef } from "react";
import { FILTER_LABELS, type Filter } from "@/lib/types";
import { SearchIcon } from "./icons";

const FILTERS: Filter[] = ["all", "active", "completed"];

type Props = {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  counts: Record<Filter, number>;
  query: string;
  onQueryChange: (query: string) => void;
};

export function FilterBar({
  filter,
  onFilterChange,
  counts,
  query,
  onQueryChange,
}: Props) {
  const searchRef = useRef<HTMLInputElement>(null);

  // 入力中以外で「/」を押したら検索へフォーカス
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="tablist"
        aria-label="表示するタスク"
        className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900"
      >
        {FILTERS.map((value) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onFilterChange(value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                active
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {FILTER_LABELS[value]}
              <span className={active ? "ml-1.5 opacity-70" : "ml-1.5 opacity-60"}>
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative ml-auto min-w-0 flex-1 sm:max-w-56">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="検索（/）"
          aria-label="タスクを検索"
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-8 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}
