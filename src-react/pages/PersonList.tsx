import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { MouseEvent, ReactNode, useCallback } from "react";
import { Link } from "react-router";
import Page from "./Page";
import { useDeletePerson } from "../hooks.ts/person";

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
  query ListPeople {
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
  query ListPeople {
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
  const [deletePerson, _] = useDeletePerson();
  const onClickDelete = useCallback((ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    if (!confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}? This cannot be undone.`)) return;
    deletePerson({ variables: { id: parseInt(person?.id || "") } })
      .then(() => {
        if (onDelete) onDelete();
      });
  }, []);

  return (
    <a href="#" data-name={`${person.firstName} ${person.lastName}`} data-id={person.id} onClick={onClickDelete}>delete</a>
  );
};

const PersonList = ({
  type = "All People",
}: {
  type?: PersonListType
}) => {
  const { data, refetch } = useQuery(PersonListQuery(type));

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
    <>
      <Link to={`/people/${p.id}/`}>edit</Link>
      <PersonDelete person={p} onDelete={refetch} />
    </>
  );

  return (
    <Page>
      <h1>{type}</h1>
      <div className="table-container">
        <div className="table-row table-header">
          {Object.keys(rows).map(rowName => (
            <div className="table-cell" key={rowName}>{rowName}</div>
          ))}
        </div>
        {/* @ts-ignore */}
        {(data?.listPeople || []).map((person) => (
          <div className="table-row" key={person.id}>
            {Object.entries(rows).map(([key, rowFn]) => (
              <div key={key} className="table-cell">{rowFn(person)}</div>
            ))}
          </div>
        ))}
      </div>
    </Page>
  );
};

export default PersonList;
