import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Debounced, PersonListType } from "./types";
import { usePersonListFilters } from "./PersonListFilters";
import { usePersonListColumns } from "./PersonListColumns";


export const usePersonList = (type: PersonListType) => {
  const filters = usePersonListFilters(type);
  const columns = usePersonListColumns(type);
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedFilterValues, setDebouncedFilterValues] = useState(() => {
    const values: { [key: string]: string | null } = {};
    filters.forEach((filter) => {
      if (filter.debounced) values[filter.key] = searchParams.get(filter.key) || "";
    });
    return values;
  });
  const debouncedRef = useRef<Debounced | null>(null);

  const setFilterValue = useCallback((key: string, value: string) => {
    const previousSearchParams = { ...Object.fromEntries(searchParams) };
    if (debouncedRef.current) {
      const { current: debounced } = debouncedRef;
      clearTimeout(debounced.timeout);
      if (debounced.key != key) {
        previousSearchParams[debounced.key] = debounced.value;
        setSearchParams(previousSearchParams);
      }
      debouncedRef.current = null;
    }

    const filter = filters.find(filter => filter.key == key);
    if (!filter) {
      throw `PersonFilter ${key} is not defined`;
    }
    if (filter.debounced) {
      const timeout = setTimeout(() => {
        setSearchParams({ ...previousSearchParams, [key]: value });
      }, 1000);
      debouncedRef.current = {
        timeout,
        key,
        value
      }
      setDebouncedFilterValues({ ...debouncedFilterValues, [key]: value });
    } else {
      setSearchParams({ ...previousSearchParams, [key]: value });
    }
  }, [searchParams, debouncedFilterValues]);

  const onChangeFilter = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const filter = ev.currentTarget.dataset.filter;
    if (!filter) throw "data-filter is missing on element";

    const value = ev.currentTarget.value;
    setFilterValue(filter, value);
  }, [setFilterValue]);

  const resetFilters = useCallback(() => {
    setSearchParams({});

    const debouncedValues: { [key: string]: string | null } = {};
    filters.forEach((filter) => {
      if (filter.debounced) debouncedValues[filter.key] = "";
    });
    setDebouncedFilterValues(debouncedValues);
  }, [type]);


  const groupByOptions: { [key: string]: string } = {};

  if (type == "Employees") {
    groupByOptions["department"] = "Department";
  }

  if (type == "Users") {
    groupByOptions["userType"] = "User Type";
  }

  return {
    columns,
    filters,
    groupByOptions,
    debouncedFilterValues,
    onChangeFilter,
    resetFilters,
  };
};
