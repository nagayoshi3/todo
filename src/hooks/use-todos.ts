"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { loadTodos, saveTodos, TODOS_KEY } from "@/lib/storage";
import { INITIAL_STATE, reducer } from "@/lib/todo-reducer";
import type { Todo } from "@/lib/types";

export function useTodos() {
  const [{ todos, hydrated }, dispatch] = useReducer(reducer, INITIAL_STATE);

  // 初回マウント時に localStorage から復元（SSR とのマークアップ不一致を避ける）
  useEffect(() => {
    dispatch({ type: "set", todos: loadTodos() });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveTodos(todos);
  }, [todos, hydrated]);

  // 別タブでの変更を取り込む
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== TODOS_KEY) return;
      dispatch({ type: "set", todos: loadTodos() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const actions = useMemo(
    () => ({
      add: (title: string, dueDate: string | null) =>
        dispatch({ type: "add", title, dueDate }),
      toggle: (id: string) => dispatch({ type: "toggle", id }),
      update: (id: string, title: string, dueDate: string | null) =>
        dispatch({ type: "update", id, title, dueDate }),
      remove: (id: string) => dispatch({ type: "remove", id }),
      clearCompleted: () => dispatch({ type: "clearCompleted" }),
      toggleAll: (completed: boolean) =>
        dispatch({ type: "toggleAll", completed }),
      move: (id: string, toIndex: number) =>
        dispatch({ type: "move", id, toIndex }),
      restore: (snapshot: Todo[]) => dispatch({ type: "set", todos: snapshot }),
    }),
    [],
  );

  const moveOver = useCallback(
    (activeId: string, overId: string) => {
      if (activeId === overId) return;
      const toIndex = todos.findIndex((t) => t.id === overId);
      if (toIndex === -1) return;
      actions.move(activeId, toIndex);
    },
    [todos, actions],
  );

  return { todos, hydrated, ...actions, moveOver };
}
