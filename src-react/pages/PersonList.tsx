import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ChangeEvent, MouseEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import Page from "./Page";
import { useConfirmAndDeletePerson } from "../hooks.ts/person";
import useDebounce from "../hooks.ts/useDebounce";

const LIST_PEOPLE = gql`
  query ListPeople {
    listPeople {
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
  query ListEmployees {
    listPeople(where:{ employee: { isNot: null }}) {
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
  query ListUsers {
    listPeople(where:{ user: { isNot: null }}) {
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

const PersonListQuery = (type: PersonListType) => {
  switch (type) {
    case "Employees":
      return LIST_EMPLOYEES;
    case "Users":
      return LIST_USERS;
    default:
      return LIST_PEOPLE;
  }
}

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
  const { data, refetch } = useQuery(PersonListQuery(type));
  const [searchParams, setSearchParams] = useSearchParams();

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

  if (type == "All People") {
    rows["Phone"] = p => p.phone;
  }

  if (type == "Employees") {
    rows["Department"] = p => p.employee.department?.name;
    rows["Title"] = p => p.employee.title;
  } else {
    rows["Is Employee"] = p => p.employee ? "yes" : "no";
  }

  if (type == "Users") {
    rows["User Type"] = p => p.user.userType;
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

  return (
    <Page>
      <h1>{type}</h1>
      <div className="table-filters">
        <input type="text" value={nameFilter} placeholder="Filter by Name" onChange={onChangeNameFilter} />
        <input type="text" value={emailFilter} placeholder="Filter by Email" onChange={onChangeEmailFilter} />
        <label htmlFor="group-by-select">
          Group By:
          <select id="group-by-select" value={searchParams.get("groupBy") || ""} onChange={onChangeGroupBy}>
            <option value="">None</option>
            <option value="department">Department</option>
            <option value="userType">User Type</option>
          </select>
        </label>
      </div>
      <div className="table-container">
        <div className="table-row table-header">
          {Object.keys(rows).map(rowName => (
            <div className="table-cell" key={rowName}>{rowName}</div>
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
