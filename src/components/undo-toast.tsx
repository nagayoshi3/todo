"use client";

type Props = {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
};

export function UndoToast({ message, onUndo, onDismiss }: Props) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-slate-900 py-2.5 pr-2 pl-4 text-sm text-white shadow-lg ring-1 ring-black/10 dark:bg-slate-100 dark:text-slate-900">
        <span className="max-w-[60vw] truncate">{message}</span>
        <button
          type="button"
          onClick={onUndo}
          className="rounded-lg px-2.5 py-1 font-semibold text-indigo-300 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 dark:text-indigo-600 dark:hover:bg-black/5"
        >
          元に戻す
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="閉じる"
          className="rounded-lg px-2 py-1 text-white/60 transition hover:bg-white/10 hover:text-white dark:text-slate-500 dark:hover:bg-black/5 dark:hover:text-slate-900"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
