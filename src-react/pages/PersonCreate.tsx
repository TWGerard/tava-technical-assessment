import PersonForm from "../components/PersonForm";
import Page from "./Page";

const PersonCreate = () => {
  return (
    <Page>
      <h1>Creating New Person</h1>
      <PersonForm person={{}} />
    </Page>
  );
};

export default PersonCreate;
