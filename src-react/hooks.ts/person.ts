import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const DELETE_PERSON = gql`
  mutation DeletePerson($id: Int!) {
    deletePerson(where: { id: $id }) {
      id
    }
  }
`;

export const useDeletePerson = () => {
  return useMutation(DELETE_PERSON);
};
