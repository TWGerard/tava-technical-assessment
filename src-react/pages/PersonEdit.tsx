import { useParams } from "react-router";
import PersonForm from "../components/PersonForm";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import Page from "./Page";

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
        departmentId
        title
      }
      user {
        id
        userType
      }
    }
  }
`;

const PersonEdit = () => {
  const { personId } = useParams();
  const { data, loading, error } = useQuery(GET_PERSON, {
    variables: { id: parseInt(personId || "") },
  });

  if (loading) return (
    <Page>Loading</Page>
  );

  if (error) return (
    <Page>Error</Page>
  );

  // @ts-expect-error
  const person = data?.findUniquePerson;

  return (
    <Page>
      <h1>Editing {person.firstName} {person.lastName}</h1>
      <PersonForm person={person} />
      <a href="#">delete</a>
    </Page>
  );
};

export default PersonEdit;
