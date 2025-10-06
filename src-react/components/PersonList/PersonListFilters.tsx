import { PersonListFilter, PersonListType } from "./types";


const NameFilter: PersonListFilter = {
  key: "name",
  label: "Filter by Name",
  debounced: true,
};

const EmailFilter: PersonListFilter = {
  key: "email",
  label: "Filter by Email",
  debounced: true,
};

const TitleFilter: PersonListFilter = {
  key: "title",
  label: "Filter by Title",
  debounced: true,
};

export const usePersonListFilters = (type: PersonListType) => {
  const baseFilters = [NameFilter, EmailFilter];
  switch (type) {
    case "Employees":
      return [...baseFilters, TitleFilter];
    case "Users":
      return baseFilters;
    default:
      return baseFilters;
  }
};
