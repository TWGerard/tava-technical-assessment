import { useParams } from "react-router";
import PersonForm from "../components/PersonForm";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

const GET_PERSON = gql`
  query GetPerson($id: Int!) {
    findUniquePerson(where: { id: $id }){
      id
      lastName
      firstName
      email
      phone
      Employee {
        id
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
    <>Loading</>
  );

  if (error) return (
    <>Error</>
  );

  // @ts-expect-error
  const person = data?.findUniquePerson;

  return (
    <>
      <h1>Editing {person.firstName} {person.lastName}</h1>
      <PersonForm person={person} />
      <a href="#">delete</a>
    </>
  );
};

export default PersonEdit;
