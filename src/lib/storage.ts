import type { Todo } from "./types";

export const TODOS_KEY = "todo-app:v1";

function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    typeof t.completed === "boolean" &&
    (t.dueDate === null || typeof t.dueDate === "string") &&
    typeof t.createdAt === "number" &&
    (t.completedAt === null || typeof t.completedAt === "number")
  );
}

/** 保存済みのタスクを読み込む。壊れたデータは黙って捨てる。 */
export function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TODOS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTodo);
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]) {
  try {
    window.localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  } catch {
    // プライベートモードや容量超過では保存を諦める（操作は継続できる）
  }
}
