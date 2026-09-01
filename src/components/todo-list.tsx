"use client";

import { useState, type DragEvent } from "react";
import type { Todo } from "@/lib/types";
import { TodoItem } from "./todo-item";

type Props = {
  todos: Todo[];
  reorderable: boolean;
  onToggle: (id: string) => void;
  onUpdate: (id: string, title: string, dueDate: string | null) => void;
  onRemove: (id: string) => void;
  onMoveBy: (id: string, delta: number) => void;
  onMoveOver: (activeId: string, overId: string) => void;
};

export function TodoList({
  todos,
  reorderable,
  onToggle,
  onUpdate,
  onRemove,
  onMoveBy,
  onMoveOver,
}: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const allowDrop = (event: DragEvent) => {
    if (!draggingId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <ul
      onDragOver={allowDrop}
      onDrop={(event) => {
        event.preventDefault();
        setDraggingId(null);
      }}
      className="divide-slate-100 dark:divide-slate-800"
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          reorderable={reorderable}
          dragging={draggingId === todo.id}
          onToggle={() => onToggle(todo.id)}
          onUpdate={(title, dueDate) => onUpdate(todo.id, title, dueDate)}
          onRemove={() => onRemove(todo.id)}
          onMoveBy={(delta) => onMoveBy(todo.id, delta)}
          onDragStart={() => setDraggingId(todo.id)}
          onDragEnter={() => {
            if (draggingId && draggingId !== todo.id) {
              onMoveOver(draggingId, todo.id);
            }
          }}
          onDragEnd={() => setDraggingId(null)}
        />
      ))}
    </ul>
  );
}
