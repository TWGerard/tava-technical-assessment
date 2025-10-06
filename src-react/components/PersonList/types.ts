import { ReactNode } from "react";

export type PersonListType = "All People" | "Employees" | "Users";

export interface PersonListFilter {
  key: string;
  label: string;
  debounced?: boolean;
};

export interface Debounced {
  timeout: ReturnType<typeof setTimeout>;
  key: string;
  value: string;
};

export interface PersonListColumn {
  key: string;
  label: string;
  cellFn: (person: any) => ReactNode;
  sortable?: boolean;
};
