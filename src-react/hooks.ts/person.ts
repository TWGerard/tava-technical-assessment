import { gql } from "@apollo/client";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { useCallback } from "react";

const DELETE_PERSON = gql`
  mutation DeletePerson($id: Int!) {
    deletePerson(where: { id: $id }) {
      id
    }
  }
`;

export const useConfirmAndDeletePerson = () => {
  const client = useApolloClient();
  const [deletePerson, _] = useMutation(DELETE_PERSON);

  return useCallback(async (person: any) => {
    if (!confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}? This cannot be undone.`)) return;
    const result = await deletePerson({ variables: { id: parseInt(person?.id || "") } });
    client.cache.evict({
      fieldName: 'listPeople'
    });
    return result;
  }, []);
};
