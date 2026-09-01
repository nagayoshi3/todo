export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  /** 期限。ローカル日付の YYYY-MM-DD 形式、未設定なら null */
  dueDate: string | null;
  createdAt: number;
  completedAt: number | null;
};

export type Filter = "all" | "active" | "completed";

export const FILTER_LABELS: Record<Filter, string> = {
  all: "すべて",
  active: "未完了",
  completed: "完了",
};
