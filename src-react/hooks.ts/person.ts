import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";

const DELETE_PERSON = gql`
  mutation DeletePerson($id: Int!) {
    deletePerson(where: { id: $id }) {
      id
    }
  }
`;

export const useConfirmAndDeletePerson = () => {
  const [deletePerson, _] = useMutation(DELETE_PERSON);

  return useCallback(async (person: any) => {
    if (!confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}? This cannot be undone.`)) return;
    return await deletePerson({ variables: { id: parseInt(person?.id || "") } });
  }, []);
};
