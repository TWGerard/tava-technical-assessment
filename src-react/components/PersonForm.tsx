import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

const PersonForm = ({
  person
}: {
  person: any
}) => {
  const { register, handleSubmit } = useForm({ defaultValues: person });
  const [createEmployee, setCreateEmployee] = useState(false);
  const [createUser, setCreateUser] = useState(false);

  const showEmployeeForm = createEmployee || !!person.Employee;
  const showUserForm = createUser || !!person.User;

  const onSubmit = useCallback((data: any) => {
    console.log("Form Submitted", data);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("firstName")} placeholder="First Name" />
        <input {...register("lastName")} placeholder="Last Name" />
        <input {...register("email")} placeholder="Email" />
        <input {...register("phone")} placeholder="Phone" maxLength={11} />
      </div>
      {!person.Employee && (
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
          <input {...register("Employee.directoryId")} />
          <input {...register("Employee.title")} placeholder="Title" />
        </div>
      )}
      {!person.User && (
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
          <select {...register("User.userType")}>
            <option value="user">User</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}

      <input type="submit" value={person.id ? "Save" : "Create"} />
    </form>
  );
};

export default PersonForm;
