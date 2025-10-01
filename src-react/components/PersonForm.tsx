import { useForm } from "react-hook-form";

const PersonForm = ({
  person
}: {
  person: any
}) => {
  const { register, handleSubmit } = useForm({ defaultValues: person });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <div>
        <input {...register("firstName")} placeholder="First Name" />
        <input {...register("lastName")} placeholder="Last Name" />
        <input {...register("email")} placeholder="Email" />
        <input {...register("phone")} placeholder="Phone" maxLength={11} />
      </div>
      <div>
        <h3>Employee Details</h3>
        <input {...register("Employee.directoryId")} />
        <input {...register("Employee.title")} placeholder="Title" />
      </div>
      <div>
        <h3>User Details</h3>
        <select {...register("User.userType")}>
          <option value="user" selected={person.User?.userType == "user"}>User</option>
          <option value="employee" selected={person.User?.userType == "employee"}>Employee</option>
          <option value="admin" selected={person.User?.userType == "admin"}>Admin</option>
        </select>
      </div>

      <input type="submit" value={person.id ? "Save" : "Create"} />
    </form>
  );
};

export default PersonForm;
