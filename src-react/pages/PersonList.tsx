import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ChangeEvent, MouseEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import Page from "./Page";
import { useConfirmAndDeletePerson } from "../hooks.ts/person";
import useDebounce from "../hooks.ts/useDebounce";

const LIST_PEOPLE = gql`
  query ListPeople($whereArgs: PersonWhereInput, $orderByArgs: [PersonOrderByWithRelationInput!]) {
    listPeople(where: $whereArgs, orderBy: $orderByArgs) {
      id
      firstName
      lastName
      email
      phone
      employee {
        id
      }
      user {
        id
      }
    } 
  }
`;
const LIST_EMPLOYEES = gql`
  query ListEmployees($whereArgs: PersonWhereInput, $orderByArgs: [PersonOrderByWithRelationInput!]) {
    listPeople(where: $whereArgs, orderBy: $orderByArgs) {
      id
      firstName
      lastName
      email
      phone
      employee {
        id
        department {
          name
        }
        title
      }
      user {
        id
      }
    } 
  }
`;
const LIST_USERS = gql`
  query ListUsers($whereArgs: PersonWhereInput, $orderByArgs: [PersonOrderByWithRelationInput!]) {
    listPeople(where: $whereArgs, orderBy: $orderByArgs) {
      id
      firstName
      lastName
      email
      phone
      employee {
        id
      }
      user {
        id
        userType
      }
    } 
  }
`;

type PersonListType = "All People" | "Employees" | "Users";

const getPersonListQuery = (type: PersonListType) => {
  switch (type) {
    case "Employees":
      return LIST_EMPLOYEES;
    case "Users":
      return LIST_USERS;
    default:
      return LIST_PEOPLE;
  }
}

const getPersonListFilters = (type: PersonListType): any => {
  switch (type) {
    case "Employees":
      return { employee: { isNot: null } };
    case "Users":
      return { user: { isNot: null } };
    default:
      return {};
  }
};

const defaultOrderBy = "name";

const PersonDelete = ({
  person,
  onDelete,
}: {
  person: any,
  onDelete?: () => void,
}) => {
  const confirmAndDeletePerson = useConfirmAndDeletePerson();
  const onClickDelete = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    confirmAndDeletePerson(person).then(onDelete);
  }, [person.id, person.firstName, person.lastName]);

  return (
    <button data-name={`${person.firstName} ${person.lastName}`} data-id={person.id} onClick={onClickDelete}>Delete</button>
  );
};

const PersonList = ({
  type = "All People",
}: {
  type?: PersonListType
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const whereArgs = getPersonListFilters(type);
  if (searchParams.get('name')) {
    whereArgs.AND = {
      firstName: {
        contains: searchParams.get('name'),
        mode: "insensitive",
      },
      OR: {
        lastName: {
          contains: searchParams.get('name'),
          mode: "insensitive",
        }
      }
    };
  }
  if (searchParams.get('email')) {
    whereArgs.email = {
      contains: searchParams.get('email'),
      mode: "insensitive",
    };
  }
  const orderByArgs: any[] = [];
  switch (searchParams.get('groupBy')) {
    case "department":
      orderByArgs.push({ employee: { department: { name: "asc" } } });
      break;
    case "userType":
      orderByArgs.push({ user: { userType: "asc" } });
      break;
  }
  const sortOrder = searchParams.get('sortOrder') || "asc";
  const orderBy = searchParams.get('orderBy') || defaultOrderBy;
  switch (searchParams.get('orderBy') || defaultOrderBy) {
    case "email":
      orderByArgs.push({ email: { sort: sortOrder, nulls: "last" } });
      break;
    case "title":
      orderByArgs.push({ employee: { title: sortOrder } });
      break;
  }
  // Always add name sorting last
  orderByArgs.push({ firstName: sortOrder });
  orderByArgs.push({ lastName: sortOrder });
  const { data, refetch } = useQuery(getPersonListQuery(type), { variables: { whereArgs, orderByArgs } });

  const [nameFilter, setNameFilter] = useState(searchParams.get("name") || "");
  useEffect(() => {
    setNameFilter(searchParams.get("name") || "");
  }, [searchParams.get("name"), type]);

  const [emailFilter, setEmailFilter] = useState(searchParams.get("email") || "");
  useEffect(() => {
    setEmailFilter(searchParams.get("email") || "");
  }, [searchParams.get("email"), type]);

  const rows: { [key: string]: (p: any) => ReactNode } = {
    "Name": p => `${p.firstName} ${p.lastName}`,
    "Email": p => p.email,
  };

  const groupByOptions: { [key: string]: string } = {};

  if (type == "All People") {
    rows["Phone"] = p => p.phone;
  }

  if (type == "Employees") {
    rows["Department"] = p => p.employee.department?.name;
    rows["Title"] = p => p.employee.title;
    groupByOptions["department"] = "Department";
  } else {
    rows["Is Employee"] = p => p.employee ? "yes" : "no";
  }

  if (type == "Users") {
    rows["User Type"] = p => p.user.userType;
    groupByOptions["userType"] = "User Type";
  } else {
    rows["Is User"] = p => p.user ? "yes" : "no";
  }

  rows[""] = p => (
    <PersonDelete person={p} onDelete={refetch} />
  );

  const changeFilter = useCallback((key: string, value: string) => {
    if (value) {
      setSearchParams({ ...Object.fromEntries(searchParams), [key]: value });
    } else {
      searchParams.delete(key);
      setSearchParams(searchParams);
    }
  }, [searchParams, type]);

  const onClickClearFilters = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setNameFilter("");
    setEmailFilter("");
    setSearchParams({});
  }, []);

  const debouncedChangeNameFilter = useDebounce((value: string) => changeFilter('name', value), 1000, [changeFilter]);
  const onChangeNameFilter = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setNameFilter(ev.currentTarget.value);
    debouncedChangeNameFilter(ev.currentTarget.value);
  }, [debouncedChangeNameFilter]);

  const debouncedChangeEmailFilter = useDebounce((value: string) => changeFilter('email', value), 1000, [changeFilter]);
  const onChangeEmailFilter = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setEmailFilter(ev.currentTarget.value);
    debouncedChangeEmailFilter(ev.currentTarget.value);
  }, [debouncedChangeEmailFilter]);

  const onChangeGroupBy = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
    changeFilter('groupBy', ev.currentTarget.value);
  }, [changeFilter]);

  const onClickHeader = useCallback((ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    const targetOrderBy = ev.currentTarget.dataset.field || defaultOrderBy;
    const currentOrderBy = searchParams.get("orderBy") || defaultOrderBy;
    const currentSortOrder = searchParams.get("sortOrder") || "asc";
    const targetSortOrder = targetOrderBy == currentOrderBy && currentSortOrder == "asc" ? "desc" : "asc";

    setSearchParams({ ...Object.fromEntries(searchParams), orderBy: targetOrderBy, sortOrder: targetSortOrder });
  }, [changeFilter, searchParams]);


  return (
    <Page>
      <h1>{type}</h1>
      <div className="table-filters">
        <input type="text" value={nameFilter} placeholder="Filter by Name" onChange={onChangeNameFilter} />
        <input type="text" value={emailFilter} placeholder="Filter by Email" onChange={onChangeEmailFilter} />
        {Object.keys(groupByOptions).length > 0 && (
          <label htmlFor="group-by-select">
            Group By:
            <select id="group-by-select" value={searchParams.get("groupBy") || ""} onChange={onChangeGroupBy}>
              <option value="">None</option>
              {Object.entries(groupByOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        )}
        <button onClick={onClickClearFilters}>Clear Filters</button>
      </div>
      <div className="table-container">
        <div className="table-row table-header">
          {Object.keys(rows).map(rowName => (
            <div className="table-cell" key={rowName}>
              {["Name", "Email", "Title"].includes(rowName) ? (
                <a href="#" data-field={rowName.toLowerCase()} onClick={onClickHeader}>
                  {rowName}
                </a>
              ) : rowName}
              {orderBy == rowName.toLowerCase() && (sortOrder == "asc" ? (
                <>&nbsp;&darr;</>
              ) : (
                <>&nbsp;&uarr;</>
              ))}
            </div>
          ))}
        </div>
        {/* @ts-ignore */}
        {(data?.listPeople || []).map((person) => (
          <Link to={`/people/${person.id}/`} className="table-row" key={person.id}>
            {Object.entries(rows).map(([key, rowFn]) => (
              <div key={key} className="table-cell">{rowFn(person)}</div>
            ))}
          </Link>
        ))}
      </div>
    </Page>
  );
};

export default PersonList;
