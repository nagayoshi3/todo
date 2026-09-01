import type { Todo } from "./types";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export type Action =
  | { type: "set"; todos: Todo[] }
  | { type: "add"; title: string; dueDate: string | null }
  | { type: "toggle"; id: string }
  | { type: "update"; id: string; title: string; dueDate: string | null }
  | { type: "remove"; id: string }
  | { type: "clearCompleted" }
  | { type: "toggleAll"; completed: boolean }
  | { type: "move"; id: string; toIndex: number };

export type State = { todos: Todo[]; hydrated: boolean };

export const INITIAL_STATE: State = { todos: [], hydrated: false };

export function reducer(state: State, action: Action): State {
  if (action.type === "set") return { todos: action.todos, hydrated: true };
  const todos = todosReducer(state.todos, action);
  // 変化がなければ同じ参照を返し、無駄な再レンダリングを避ける
  return todos === state.todos ? state : { ...state, todos };
}

function todosReducer(
  todos: Todo[],
  action: Exclude<Action, { type: "set" }>,
): Todo[] {
  switch (action.type) {
    case "add": {
      const title = action.title.trim();
      if (!title) return todos;
      const todo: Todo = {
        id: createId(),
        title,
        completed: false,
        dueDate: action.dueDate,
        createdAt: Date.now(),
        completedAt: null,
      };
      return [todo, ...todos];
    }

    case "toggle": {
      if (!todos.some((t) => t.id === action.id)) return todos;
      return todos.map((t) =>
        t.id === action.id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: t.completed ? null : Date.now(),
            }
          : t,
      );
    }

    case "update": {
      const title = action.title.trim();
      if (!title) return todos;
      if (!todos.some((t) => t.id === action.id)) return todos;
      return todos.map((t) =>
        t.id === action.id ? { ...t, title, dueDate: action.dueDate } : t,
      );
    }

    case "remove": {
      const next = todos.filter((t) => t.id !== action.id);
      return next.length === todos.length ? todos : next;
    }

    case "clearCompleted": {
      const next = todos.filter((t) => !t.completed);
      return next.length === todos.length ? todos : next;
    }

    case "toggleAll": {
      if (todos.every((t) => t.completed === action.completed)) return todos;
      return todos.map((t) =>
        t.completed === action.completed
          ? t
          : {
              ...t,
              completed: action.completed,
              completedAt: action.completed ? Date.now() : null,
            },
      );
    }

    case "move": {
      const from = todos.findIndex((t) => t.id === action.id);
      if (from === -1) return todos;
      const to = Math.max(0, Math.min(todos.length - 1, action.toIndex));
      if (from === to) return todos;
      const next = todos.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    }
  }
}
