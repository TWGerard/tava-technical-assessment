import Button from "@mui/material/Button";
import { useConfirmAndDeletePerson } from "../hooks/person";
import { MouseEvent, useCallback } from "react";

const PersonDeleteButton = ({
  person,
  onDelete,
}: {
  person: any,
  onDelete?: () => void,
}) => {
  const confirmAndDeletePerson = useConfirmAndDeletePerson();
  const onClickDelete = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    confirmAndDeletePerson(person).then(onDelete);
  }, [person.id, person.firstName, person.lastName]);

  return (
    <Button
      data-name={`${person.firstName} ${person.lastName}`}
      data-id={person.id}
      onClick={onClickDelete}
      variant="contained"
      color="error"
      size="small"
    >
      Delete
    </Button>
  );
};

export default PersonDeleteButton;
