import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Box from '@mui/material/Box';
import { useListDepartments } from "../hooks/department";
import FormControl from '@mui/material/FormControl';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

const PersonForm = ({
  person,
  onSubmit,
  disabled = false,
  error,
  extraButtons,
}: {
  person: any,
  onSubmit: (data: any) => void,
  disabled?: boolean,
  error?: any,
  extraButtons?: ReactNode,
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
  }, [error]);

  const sx = { mb: 2 };
  const gridSize = { xs: 12, md: 6 };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={sx}>
        <Grid container spacing={2}>
          <Grid size={gridSize}>
            <TextField {...register("firstName")} required label="First Name" fullWidth />
          </Grid>
          <Grid size={gridSize}>
            <TextField {...register("lastName")} required label="Last Name" fullWidth />
          </Grid>
          <Grid size={gridSize}>
            <TextField {...register("email")} type="email" label="Email" fullWidth />
          </Grid>
          <Grid size={gridSize}>
            <TextField {...register("phone")} label="Phone" inputProps={{ minLength: 11, maxLength: 11 }} fullWidth />
          </Grid>
        </Grid>
      </Box>
      {!person.employee && (
        <Box sx={sx}>
          <FormControlLabel
            control={<Checkbox checked={createEmployee} onChange={(ev) => setCreateEmployee(ev.target.checked)} />}
            label="Create Employee"
            disabled={disabled}
          />
        </Box>
      )}
      {showEmployeeForm && (
        <Box sx={sx}>
          <h3>Employee Details</h3>
          <Grid container spacing={2}>
            <Grid size={gridSize}>
              <TextField
                {...register("employee.department.name")}
                label="Department"
                autoComplete="off"
                slotProps={{ htmlInput: { list: "department-suggestions" } }}
                fullWidth
              />
              <datalist id="department-suggestions">
                {departments.map((department) => (
                  <option key={department.id} value={department.name}>{department.employeeCount} Employee{department.employeeCount == 1 ? "" : "s"}</option>
                ))}
              </datalist>
            </Grid>
            <Grid size={gridSize}>
              <TextField {...register("employee.title")} required label="Title" fullWidth />
            </Grid>
          </Grid>
        </Box>
      )}
      {!person.user && (
        <Box sx={sx}>
          <FormControlLabel
            control={<Checkbox checked={createUser} onChange={(ev) => setCreateUser(ev.target.checked)} />}
            label="Create User"
            disabled={disabled}
          />
        </Box>
      )}
      {showUserForm && (
        <Box sx={sx}>
          <h3>User Details</h3>
          <Grid container spacing={2}>
            <Grid size={gridSize}>
              <FormControl fullWidth>
                <InputLabel id="user-type">User Type</InputLabel>
                <Select {...register("user.userType")} required>
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="STAFF">Staff</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button type="submit" variant="contained">{person.id ? "Save" : "Create"}</Button>
        {extraButtons}
      </Stack>
    </form>
  );
};

export default PersonForm;
