import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useListDepartments } from "../hooks.ts/department";

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
      <div>
        <input {...register("firstName")} required placeholder="First Name" />
        <input {...register("lastName")} required placeholder="Last Name" />
        <input {...register("email")} type="email" placeholder="Email" />
        <input {...register("phone")} placeholder="Phone" maxLength={11} />
      </div>
      {!person.employee && (
        <div>
          <label htmlFor="create-employee-checkbox">
            <input
              id="create-employee-checkbox"
              type="checkbox"
              checked={createEmployee}
              onChange={(ev) => setCreateEmployee(ev.target.checked)}
            />
            <span>Create Employee</span>
          </label>
        </div>
      )}
      {showEmployeeForm && (
        <div>
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
          <input {...register("employee.title")} required placeholder="Title" />
        </div>
      )}
      {!person.user && (
        <div>
          <label htmlFor="create-user-checkbox">
            <input
              id="create-user-checkbox"
              type="checkbox"
              checked={createUser}
              onChange={(ev) => setCreateUser(ev.target.checked)}
            />
            <span>Create User</span>
          </label>
        </div>
      )}
      {showUserForm && (
        <div>
          <h3>User Details</h3>
          <select {...register("user.userType")} required>
            <option value="USER">User</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      )}

      <input type="submit" value={person.id ? "Save" : "Create"} />
    </form>
  );
};

export default PersonForm;
