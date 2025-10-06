import { useNavigate, useParams } from "react-router";
import PersonForm from "../components/PersonForm";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import Page from "./Page";
import { MouseEvent, useCallback } from "react";
import { useConfirmAndDeletePerson } from "../hooks/person";
import Button from "@mui/material/Button";

const GET_PERSON = gql`
  query GetPerson($id: Int!) {
    findUniquePerson(where: { id: $id }){
      id
      lastName
      firstName
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
        userType
      }
    }
  }
`;

const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: Int!, $data: PersonUpdateInput!) {
    updatePerson(where: { id: $id }, data: $data) {
      id
      employee {
        id
      }
    }
  }
`;

const updateQuery = (data: { [key: string]: any }, original: { [key: string]: any } | undefined = undefined) => {
  const query: { [key: string]: any } = {};
  Object.entries(data).forEach(([k, v]) => {
    if (typeof v != "string" || v == "" || ["id", "__typename"].includes(k) || (original && original[k] == v)) return;
    query[k] = original ? { set: v } : v;
  });
  return query;
};



const PersonEdit = () => {
  const client = useApolloClient();
  const { personId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_PERSON, {
    variables: { id: parseInt(personId || "") },
  });
  const [updatePerson, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(UPDATE_PERSON);
  const confirmAndDeletePerson = useConfirmAndDeletePerson();

  // @ts-expect-error
  const person = data?.findUniquePerson;

  const onClickDelete = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    confirmAndDeletePerson(person).then((result) => {
      if (result) navigate("/people/");
    });
  }, [person?.id, person?.firstName, person?.lastName]);

  const onSubmit = useCallback((data: any) => {
    const query = updateQuery(data, person);

    if (data.user) {
      query.user = {
        upsert: {
          where: { personId: { equals: parseInt(person.id || "") } },
          create: updateQuery(data.user),
          update: updateQuery(data.user, person.user || {})
        }
      };
    }

    if (data.employee) {
      query.employee = {
        upsert: {
          where: { personId: { equals: parseInt(person.id || "") } },
          create: updateQuery(data.employee),
          update: updateQuery(data.employee, person.employee || {})
        }
      };
      if (data.employee.department?.name) {
        const department = {
          connectOrCreate: {
            where: { name: data.employee.department.name },
            create: updateQuery(data.employee.department || {})
          }
        }
        query.employee.upsert.create.department = department;
        query.employee.upsert.update.department = department;
      }
    }

    updatePerson({ variables: { id: parseInt(person.id || ""), data: query } }).then(() => {
      client.cache.evict({
        fieldName: 'listPeople'
      });
    });
  }, [person?.id]);


  // @ts-ignore
  if (updateData?.updatePerson?.id) navigate(updateData.updatePerson.employee ? "/employees/" : "/people/");

  return (
    <Page>
      <h1>Editing {person?.firstName} {person?.lastName}</h1>
      {loading ? (
        <>Loading</>
      ) : error ? (
        <>Error</>
      ) : (
        <>
          <PersonForm
            person={person}
            onSubmit={onSubmit}
            disabled={updateLoading}
            error={updateError}
            extraButtons={
              <Button
                onClick={onClickDelete}
                className={updateLoading ? "disabled" : ""}
                variant="contained"
                color="error"
              >Delete</Button>
            }
          />
        </>
      )}
    </Page>
  );
};

export default PersonEdit;
