import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { EmployeeService } from "./employee.service";
import { Employee } from "src-nest/prismagraphql/employee";
import { Department } from "src-nest/prismagraphql/department";

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) { }

  @ResolveField('department', () => Department)
  department(@Parent() employee: Employee) {
    return this.employeeService.prisma.department.findUnique({ where: { id: employee.departmentId } });
  }
}
