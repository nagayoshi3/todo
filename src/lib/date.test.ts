import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { daysUntil, formatDue, todayISO } from "./date.ts";

describe("date", () => {
  it("todayISO は YYYY-MM-DD を返す", () => {
    assert.match(todayISO(), /^\d{4}-\d{2}-\d{2}$/);
  });

  it("daysUntil は基準日からの日数を返す", () => {
    assert.equal(daysUntil("2026-09-02", "2026-09-02"), 0);
    assert.equal(daysUntil("2026-09-05", "2026-09-02"), 3);
    assert.equal(daysUntil("2026-08-30", "2026-09-02"), -3);
    // 月またぎ・夏時間の切り替えを跨いでも日数がずれない
    assert.equal(daysUntil("2026-11-05", "2026-10-29"), 7);
    assert.equal(daysUntil("こわれた値", "2026-09-02"), null);
  });

  it("formatDue は残り日数に応じたラベルとトーンを返す", () => {
    const today = todayISO();
    assert.deepEqual(formatDue(today), { label: "今日", tone: "today" });

    const shift = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    assert.deepEqual(formatDue(shift(1)), { label: "明日", tone: "soon" });
    assert.deepEqual(formatDue(shift(3)), { label: "3日後", tone: "soon" });
    assert.deepEqual(formatDue(shift(-2)), { label: "2日超過", tone: "overdue" });
    assert.equal(formatDue(shift(30)).tone, "normal");
    assert.match(formatDue(shift(30)).label, /月\d+日$/);
  });
});
