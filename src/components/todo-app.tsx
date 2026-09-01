"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTodos } from "@/hooks/use-todos";
import type { Filter, Todo } from "@/lib/types";
import { FilterBar } from "./filter-bar";
import { ThemeToggle } from "./theme-toggle";
import { TodoInput } from "./todo-input";
import { TodoList } from "./todo-list";
import { UndoToast } from "./undo-toast";

const UNDO_TIMEOUT = 7000;

type Undoable = { message: string; snapshot: Todo[] };

export function TodoApp() {
  const {
    todos,
    hydrated,
    add,
    toggle,
    update,
    remove,
    clearCompleted,
    toggleAll,
    move,
    moveOver,
    restore,
  } = useTodos();

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [undoable, setUndoable] = useState<Undoable | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleUndo = useCallback((message: string, snapshot: Todo[]) => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndoable({ message, snapshot });
    undoTimer.current = setTimeout(() => setUndoable(null), UNDO_TIMEOUT);
  }, []);

  const dismissUndo = useCallback(() => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndoable(null);
  }, []);

  useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);

  const counts = useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    return {
      all: todos.length,
      active: todos.length - completed,
      completed,
    } satisfies Record<Filter, number>;
  }, [todos]);

  const normalizedQuery = query.trim().toLowerCase();

  const visible = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === "active" && todo.completed) return false;
      if (filter === "completed" && !todo.completed) return false;
      if (normalizedQuery && !todo.title.toLowerCase().includes(normalizedQuery)) {
        return false;
      }
      return true;
    });
  }, [todos, filter, normalizedQuery]);

  // 並べ替えは全件表示のときだけ（絞り込み中は行の前後関係が実データと合わない）
  const reorderable = filter === "all" && normalizedQuery === "";

  const handleRemove = (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    const snapshot = todos;
    remove(id);
    scheduleUndo(`「${target.title}」を削除しました`, snapshot);
  };

  const handleClearCompleted = () => {
    if (counts.completed === 0) return;
    const snapshot = todos;
    clearCompleted();
    scheduleUndo(`完了した ${counts.completed} 件を削除しました`, snapshot);
  };

  const handleUndo = () => {
    if (!undoable) return;
    restore(undoable.snapshot);
    dismissUndo();
  };

  const handleMoveBy = (id: string, delta: number) => {
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return;
    move(id, index + delta);
  };

  const allCompleted = counts.all > 0 && counts.active === 0;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">やること</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {hydrated && counts.all > 0
              ? `残り ${counts.active} 件 / 全 ${counts.all} 件`
              : "このブラウザに保存されます"}
          </p>
        </div>
        <ThemeToggle />
      </header>

      <TodoInput onAdd={add} />

      <div className="mt-5 space-y-3">
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          counts={counts}
          query={query}
          onQueryChange={setQuery}
        />

        <section
          aria-label="タスク一覧"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          {!hydrated ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-6 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              {counts.all === 0
                ? "まだタスクがありません。上の入力欄から追加してください。"
                : "条件に合うタスクはありません。"}
            </p>
          ) : (
            <TodoList
              todos={visible}
              reorderable={reorderable}
              onToggle={toggle}
              onUpdate={update}
              onRemove={handleRemove}
              onMoveBy={handleMoveBy}
              onMoveOver={moveOver}
            />
          )}
        </section>

        {hydrated && counts.all > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => toggleAll(!allCompleted)}
              className="rounded-lg px-2 py-1 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              {allCompleted ? "すべて未完了に戻す" : "すべて完了にする"}
            </button>
            <button
              type="button"
              onClick={handleClearCompleted}
              disabled={counts.completed === 0}
              className="rounded-lg px-2 py-1 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            >
              完了済みを削除
              {counts.completed > 0 && `（${counts.completed}）`}
            </button>
          </div>
        )}
      </div>

      {undoable && (
        <UndoToast
          message={undoable.message}
          onUndo={handleUndo}
          onDismiss={dismissUndo}
        />
      )}
    </main>
  );
}
