"use client";

import { useRef, useState, type FormEvent } from "react";
import { todayISO } from "@/lib/date";
import { CalendarIcon, PlusIcon } from "./icons";

type Props = {
  onAdd: (title: string, dueDate: string | null) => void;
};

export function TodoInput({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDue, setShowDue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      inputRef.current?.focus();
      return;
    }
    onAdd(title, dueDate || null);
    setTitle("");
    setDueDate("");
    setShowDue(false);
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-indigo-500"
    >
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          autoFocus
          enterKeyHint="done"
          placeholder="やることを入力…"
          aria-label="新しいタスク"
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[15px] placeholder:text-slate-400 focus:outline-none dark:placeholder:text-slate-500"
        />
        <button
          type="button"
          onClick={() => setShowDue((v) => !v)}
          aria-expanded={showDue}
          aria-label="期限を設定"
          title="期限を設定"
          className={`rounded-lg p-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
            showDue || dueDate
              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <CalendarIcon className="h-[18px] w-[18px]" />
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          <PlusIcon className="h-4 w-4" />
          追加
        </button>
      </div>

      {showDue && (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-3 pt-2.5 pb-1 text-sm dark:border-slate-800">
          <label htmlFor="new-due" className="text-slate-500 dark:text-slate-400">
            期限
          </label>
          <input
            id="new-due"
            type="date"
            value={dueDate}
            min="1970-01-01"
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
          />
          <button
            type="button"
            onClick={() => setDueDate(todayISO())}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            今日
          </button>
          {dueDate && (
            <button
              type="button"
              onClick={() => setDueDate("")}
              className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              クリア
            </button>
          )}
        </div>
      )}
    </form>
  );
}
