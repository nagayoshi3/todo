export type DueTone = "overdue" | "today" | "soon" | "normal";

/** ローカルタイムの今日を YYYY-MM-DD で返す（date input の value と揃える） */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toLocalDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 期限までの日数（今日 = 0、過ぎていれば負の数） */
export function daysUntil(iso: string, from = todayISO()): number | null {
  const target = toLocalDate(iso);
  const base = toLocalDate(from);
  if (!target || !base) return null;
  return Math.round((target.getTime() - base.getTime()) / 86_400_000);
}

export function formatDue(iso: string): { label: string; tone: DueTone } {
  const diff = daysUntil(iso);
  const date = toLocalDate(iso);
  if (diff === null || !date) return { label: iso, tone: "normal" };

  if (diff < 0) return { label: `${-diff}日超過`, tone: "overdue" };
  if (diff === 0) return { label: "今日", tone: "today" };
  if (diff === 1) return { label: "明日", tone: "soon" };
  if (diff <= 6) return { label: `${diff}日後`, tone: "soon" };

  const sameYear = date.getFullYear() === new Date().getFullYear();
  const label = `${sameYear ? "" : `${date.getFullYear()}年`}${date.getMonth() + 1}月${date.getDate()}日`;
  return { label, tone: "normal" };
}
