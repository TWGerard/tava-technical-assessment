import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import { useListDepartments } from "../hooks.ts/department";
import FormControl from '@mui/material/FormControl';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const PersonForm = ({
  person,
  onSubmit,
  disabled = false,
  error,
}: {
  person: any,
  onSubmit: (data: any) => void,
  disabled?: boolean,
  error?: any,
}) => {
  const { data: departmentsData } = useListDepartments();
  const { register, handleSubmit, setValue, getValues } = useForm({ defaultValues: person, disabled: disabled });
  const [createEmployee, setCreateEmployee] = useState(false);
  const [createUser, setCreateUser] = useState(false);

  // @ts-ignore
  const departments: any[] = departmentsData?.listDepartments || [];

  const showEmployeeForm = createEmployee || !!person.employee;
  const showUserForm = createUser || !!person.user;

  if (!showEmployeeForm && getValues("employee")) setValue("employee", undefined);
  if (!showUserForm && getValues("user")) setValue("user", undefined);

  // TODO: Show inline errors instead of using a popup
  useEffect(() => {
    if (!error) return;
    alert(error.message);
  }, [error])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <TextField {...register("firstName")} required label="First Name" />
        <TextField {...register("lastName")} required label="Last Name" />
        <TextField {...register("email")} type="email" label="Email" />
        <TextField {...register("phone")} label="Phone" inputProps={{ minLength: 11, maxLength: 11 }} />
      </Box>
      {!person.employee && (
        <div>
          <FormControlLabel
            control={<Checkbox checked={createEmployee} onChange={(ev) => setCreateEmployee(ev.target.checked)} />}
            label="Create Employee"
          />
        </div>
      )}
      {showEmployeeForm && (
        <Box>
          <h3>Employee Details</h3>
          <input
            {...register("employee.department.name")}
            placeholder="Department"
            autoComplete="off"
            list="department-suggestions"
          />
          <datalist id="department-suggestions">
            {departments.map((department) => (
              <option key={department.id} value={department.name}>{department.employeeCount} Employee{department.employeeCount == 1 ? "" : "s"}</option>
            ))}
          </datalist>
          <TextField {...register("employee.title")} required label="Title" />
        </Box>
      )}
      {!person.user && (
        <div>
          <FormControlLabel
            control={<Checkbox checked={createUser} onChange={(ev) => setCreateUser(ev.target.checked)} />}
            label="Create Employee"
          />
        </div>
      )}
      {showUserForm && (
        <Box>
          <h3>User Details</h3>
          <FormControl fullWidth>
            <InputLabel id="user-type">User Type</InputLabel>
            <Select {...register("user.userType")} required>
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="STAFF">Staff</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      <input type="submit" value={person.id ? "Save" : "Create"} />
    </form>
  );
};

export default PersonForm;
