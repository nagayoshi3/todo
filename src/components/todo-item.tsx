"use client";

import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { formatDue, type DueTone } from "@/lib/date";
import type { Todo } from "@/lib/types";
import { CheckIcon, GripIcon, PencilIcon, TrashIcon } from "./icons";

const DUE_TONE: Record<DueTone, string> = {
  overdue:
    "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30",
  today:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  soon: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  normal:
    "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
};

type Props = {
  todo: Todo;
  reorderable: boolean;
  dragging: boolean;
  onToggle: () => void;
  onUpdate: (title: string, dueDate: string | null) => void;
  onRemove: () => void;
  onMoveBy: (delta: number) => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
};

export function TodoItem({
  todo,
  reorderable,
  dragging,
  onToggle,
  onUpdate,
  onRemove,
  onMoveBy,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [draftDue, setDraftDue] = useState(todo.dueDate ?? "");
  const [dragArmed, setDragArmed] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) editRef.current?.select();
  }, [editing]);

  const startEditing = () => {
    setDraftTitle(todo.title);
    setDraftDue(todo.dueDate ?? "");
    setEditing(true);
  };

  const commit = () => {
    if (draftTitle.trim()) onUpdate(draftTitle, draftDue || null);
    setEditing(false);
  };

  const onEditKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setEditing(false);
    }
  };

  const onHandleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      onMoveBy(event.key === "ArrowUp" ? -1 : 1);
    }
  };

  const handleDragStart = (event: DragEvent<HTMLLIElement>) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", todo.id);
    onDragStart();
  };

  const due = todo.dueDate ? formatDue(todo.dueDate) : null;

  return (
    <li
      draggable={reorderable && dragArmed && !editing}
      onDragStart={handleDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={() => {
        setDragArmed(false);
        onDragEnd();
      }}
      className={`group flex items-start gap-2.5 border-b border-slate-100 px-2.5 py-2.5 transition-colors last:border-b-0 hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/40 ${
        dragging ? "todo-dragging" : ""
      }`}
    >
      {reorderable && (
        <button
          type="button"
          aria-label={`「${todo.title}」を並べ替え（上下キーで移動）`}
          title="ドラッグ、または上下キーで並べ替え"
          onPointerDown={() => setDragArmed(true)}
          onPointerUp={() => setDragArmed(false)}
          onKeyDown={onHandleKeyDown}
          className="mt-1.5 cursor-grab touch-none rounded p-0.5 text-slate-300 opacity-0 transition hover:text-slate-500 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 group-hover:opacity-100 active:cursor-grabbing dark:text-slate-600 dark:hover:text-slate-400"
        >
          <GripIcon className="h-4 w-4" />
        </button>
      )}

      <label className="mt-0.5 shrink-0 cursor-pointer p-0.5">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          aria-label={`「${todo.title}」を${todo.completed ? "未完了に戻す" : "完了にする"}`}
          className="peer sr-only"
        />
        <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md border-2 border-slate-300 text-transparent transition peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-500 dark:border-slate-600 dark:peer-checked:border-indigo-500 dark:peer-checked:bg-indigo-500">
          <CheckIcon className="h-3.5 w-3.5" />
        </span>
      </label>

      {editing ? (
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 py-0.5">
          <input
            ref={editRef}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={onEditKeyDown}
            aria-label="タスク名を編集"
            className="min-w-0 flex-1 rounded-lg border border-indigo-400 bg-white px-2 py-1 text-[15px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-950"
          />
          <input
            type="date"
            value={draftDue}
            onChange={(e) => setDraftDue(e.target.value)}
            onKeyDown={onEditKeyDown}
            aria-label="期限を編集"
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950"
          />
          <button
            type="button"
            onClick={commit}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            保存
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            キャンセル
          </button>
        </div>
      ) : (
        <>
          <div className="min-w-0 flex-1 py-0.5">
            <span
              onDoubleClick={startEditing}
              title="ダブルクリックで編集"
              className={`block text-[15px] leading-6 break-words ${
                todo.completed
                  ? "text-slate-400 line-through decoration-slate-300 dark:text-slate-500 dark:decoration-slate-600"
                  : ""
              }`}
            >
              {todo.title}
            </span>
            {due && (
              <span
                className={`mt-1 inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                  todo.completed ? DUE_TONE.normal : DUE_TONE[due.tone]
                }`}
              >
                {due.label}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={startEditing}
              aria-label={`「${todo.title}」を編集`}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <PencilIcon className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              aria-label={`「${todo.title}」を削除`}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            >
              <TrashIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </>
      )}
    </li>
  );
}
