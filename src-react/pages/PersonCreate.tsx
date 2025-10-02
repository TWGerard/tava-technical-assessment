import { gql } from "@apollo/client";
import PersonForm from "../components/PersonForm";
import Page from "./Page";
import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router";
import { removeEmptyStrings } from "../utils.ts/string";


const CREATE_PERSON = gql`
  mutation CreatePerson($data: PersonCreateInput!) {
    createPerson(data: $data) {
      id
      employee {
        id
      }
    }
  }
`;


const PersonCreate = () => {
  const [createPerson, { data, loading, error }] = useMutation(CREATE_PERSON);
  const navigate = useNavigate();

  const onSubmit = useCallback((data: any) => {
    removeEmptyStrings(data);

    if (data.user) {
      removeEmptyStrings(data.user);
      data.user = { create: data.user };
    }

    if (data.employee) {
      removeEmptyStrings(data.employee);
      data.employee.department = {
        connectOrCreate: {
          where: data.employee.department,
          create: data.employee.department,
        }
      };
      data.employee = { create: data.employee };
    }

    createPerson({ variables: { data } });
  }, []);

  // @ts-ignore
  if (data?.createPerson?.id) navigate(data.createPerson.employee ? "/employees/" : "/people/");

  return (
    <Page>
      <h1>New Person</h1>
      <PersonForm person={{}} onSubmit={onSubmit} disabled={loading} error={error} />
    </Page>
  );
};

export default PersonCreate;
