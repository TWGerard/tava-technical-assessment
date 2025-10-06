import { PersonListColumn, PersonListType } from "./types";
import CheckIcon from "@mui/icons-material/CheckCircleOutline";
import RemoveIcon from "@mui/icons-material/RadioButtonUnchecked";

const NameColumn: PersonListColumn = {
  key: "name",
  label: "Name",
  cellFn: person => `${person.firstName} ${person.lastName}`,
  sortable: true,
};

const EmailColumn: PersonListColumn = {
  key: "email",
  label: "Email",
  cellFn: person => person.email,
  sortable: true,
};

const PhoneColumn: PersonListColumn = {
  key: "phone",
  label: "Phone",
  cellFn: person => person.phone,
};

const IsEmployeeColumn: PersonListColumn = {
  key: "is-employee",
  label: "Is Employee",
  cellFn: person => person.employee ? <CheckIcon /> : <RemoveIcon />,
};

const IsUserColumn: PersonListColumn = {
  key: "is-user",
  label: "Is User",
  cellFn: person => person.user ? <CheckIcon /> : <RemoveIcon />,
};

const DepartmentColumn: PersonListColumn = {
  key: "department",
  label: "Department",
  cellFn: person => person.employee?.department?.name,
};

const TitleColumn: PersonListColumn = {
  key: "title",
  label: "Title",
  cellFn: person => person.employee?.title,
  sortable: true,
};

const UserTypeColumn: PersonListColumn = {
  key: "user-type",
  label: "User Type",
  cellFn: person => person.user?.userType,
};

export const usePersonListColumns = (type: PersonListType) => {
  const columns = [
    NameColumn,
    EmailColumn,
  ];

  if (type == "All People") {
    columns.push(PhoneColumn);
  }

  if (type == "Employees") {
    columns.push(DepartmentColumn);
    columns.push(TitleColumn);
  }

  if (type == "Users") {
    columns.push(UserTypeColumn);
  }

  if (type != "Employees") columns.push(IsEmployeeColumn);
  if (type != "Users") columns.push(IsUserColumn);

  return columns;
}
