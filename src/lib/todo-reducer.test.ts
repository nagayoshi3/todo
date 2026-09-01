import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { INITIAL_STATE, reducer, type State } from "./todo-reducer.ts";
import type { Todo } from "./types.ts";

function seed(titles: string[]): State {
  const todos: Todo[] = titles.map((title, i) => ({
    id: `id-${i}`,
    title,
    completed: false,
    dueDate: null,
    createdAt: i,
    completedAt: null,
  }));
  return { todos, hydrated: true };
}

const titles = (state: State) => state.todos.map((t) => t.title);

describe("reducer", () => {
  it("set で復元し hydrated が立つ", () => {
    const state = reducer(INITIAL_STATE, { type: "set", todos: seed(["A"]).todos });
    assert.equal(state.hydrated, true);
    assert.deepEqual(titles(state), ["A"]);
  });

  it("add は先頭に追加し、前後の空白を落とす", () => {
    const state = reducer(seed(["A"]), {
      type: "add",
      title: "  B  ",
      dueDate: "2026-09-10",
    });
    assert.deepEqual(titles(state), ["B", "A"]);
    assert.equal(state.todos[0].dueDate, "2026-09-10");
    assert.equal(state.todos[0].completed, false);
  });

  it("空文字の add は無視する（同一参照）", () => {
    const before = seed(["A"]);
    assert.equal(reducer(before, { type: "add", title: "   ", dueDate: null }), before);
  });

  it("toggle で完了と完了日時が切り替わる", () => {
    const done = reducer(seed(["A"]), { type: "toggle", id: "id-0" });
    assert.equal(done.todos[0].completed, true);
    assert.equal(typeof done.todos[0].completedAt, "number");

    const undone = reducer(done, { type: "toggle", id: "id-0" });
    assert.equal(undone.todos[0].completed, false);
    assert.equal(undone.todos[0].completedAt, null);
  });

  it("存在しない id への toggle / update / remove は状態を変えない", () => {
    const before = seed(["A"]);
    assert.equal(reducer(before, { type: "toggle", id: "none" }), before);
    assert.equal(
      reducer(before, { type: "update", id: "none", title: "X", dueDate: null }),
      before,
    );
    assert.equal(reducer(before, { type: "remove", id: "none" }), before);
  });

  it("update は本文と期限を書き換え、空タイトルは拒否する", () => {
    const before = seed(["A"]);
    const after = reducer(before, {
      type: "update",
      id: "id-0",
      title: " 新しい名前 ",
      dueDate: "2026-01-01",
    });
    assert.equal(after.todos[0].title, "新しい名前");
    assert.equal(after.todos[0].dueDate, "2026-01-01");
    assert.equal(
      reducer(before, { type: "update", id: "id-0", title: "  ", dueDate: null }),
      before,
    );
  });

  it("remove と clearCompleted", () => {
    const state = reducer(seed(["A", "B", "C"]), { type: "remove", id: "id-1" });
    assert.deepEqual(titles(state), ["A", "C"]);

    const withDone = reducer(state, { type: "toggle", id: "id-0" });
    assert.deepEqual(titles(reducer(withDone, { type: "clearCompleted" })), ["C"]);
    assert.equal(reducer(state, { type: "clearCompleted" }), state);
  });

  it("toggleAll はすべてを揃える", () => {
    const all = reducer(seed(["A", "B"]), { type: "toggleAll", completed: true });
    assert.deepEqual(
      all.todos.map((t) => t.completed),
      [true, true],
    );
    assert.equal(reducer(all, { type: "toggleAll", completed: true }), all);

    const none = reducer(all, { type: "toggleAll", completed: false });
    assert.deepEqual(
      none.todos.map((t) => t.completedAt),
      [null, null],
    );
  });

  it("move は範囲内に丸めて並べ替える", () => {
    const base = seed(["A", "B", "C"]);
    assert.deepEqual(titles(reducer(base, { type: "move", id: "id-2", toIndex: 0 })), [
      "C",
      "A",
      "B",
    ]);
    assert.deepEqual(titles(reducer(base, { type: "move", id: "id-0", toIndex: 99 })), [
      "B",
      "C",
      "A",
    ]);
    assert.deepEqual(titles(reducer(base, { type: "move", id: "id-2", toIndex: -5 })), [
      "C",
      "A",
      "B",
    ]);
    assert.equal(reducer(base, { type: "move", id: "id-1", toIndex: 1 }), base);
    assert.equal(reducer(base, { type: "move", id: "none", toIndex: 0 }), base);
  });
});
