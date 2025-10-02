import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ReactNode } from "react";
import { Link } from "react-router";
import Page from "./Page";

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
        departmentId
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

const PersonList = ({
  type = "All People",
}: {
  type?: PersonListType
}) => {
  const { data } = useQuery(PersonListQuery(type));

  const rows: { [key: string]: (p: any) => ReactNode } = {
    "Name": p => `${p.firstName} ${p.lastName}`,
    "Email": p => p.email,
  };

  if (type == "All People") {
    rows["Phone"] = p => p.phone;
  }

  if (type == "Employees") {
    rows["Department"] = p => p.employee.departmentId;
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
      <a href="#">delete</a>
    </>
  );

  return (
    <Page>
      <h1>{type}</h1>
      <div className="table-container">
        <div className="table-row">
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
