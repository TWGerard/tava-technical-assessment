import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ReactNode } from "react";
import { Link } from "react-router";

const LIST_PEOPLE = gql`
  query ListPeople {
    listPeople {
      id
      firstName
      lastName
      email
      phone
      Employee {
        id
      }
      User {
        id
      }
    } 
  }
`;
const LIST_EMPLOYEES = gql`
  query ListPeople {
    listPeople(where:{ Employee: { isNot: null }}) {
      id
      firstName
      lastName
      email
      phone
      Employee {
        id
        departmentId
        title
      }
      User {
        id
      }
    } 
  }
`;
const LIST_USERS = gql`
  query ListPeople {
    listPeople(where:{ User: { isNot: null }}) {
      id
      firstName
      lastName
      email
      phone
      Employee {
        id
      }
      User {
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
    rows["Department"] = p => p.Employee.departmentId;
    rows["Title"] = p => p.Employee.title;
  } else {
    rows["Is Employee"] = p => p.Employee ? "yes" : "no";
  }

  if (type == "Users") {
    rows["User Type"] = p => p.User.userType;
  } else {
    rows["Is User"] = p => p.User ? "yes" : "no";
  }

  rows[""] = p => (
    <>
      <Link to={`/people/${p.id}/`}>edit</Link>
      <a href="#">delete</a>
    </>
  );

  return (
    <>
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
    </>
  );
};

export default PersonList;
