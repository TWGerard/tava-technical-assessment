import {
  Department,
  FindFirstDepartmentArgs,
  FindUniqueDepartmentArgs,
  FindManyDepartmentArgs,
  DepartmentGroupBy,
  DepartmentGroupByArgs,
  AggregateDepartment,
  DepartmentAggregateArgs,
  CreateOneDepartmentArgs,
  CreateManyDepartmentArgs,
  UpdateOneDepartmentArgs,
  UpdateManyDepartmentArgs,
  DeleteOneDepartmentArgs,
  DeleteManyDepartmentArgs,
  DepartmentCount,
} from "../prismagraphql/department";
import { AffectedRows } from "../prismagraphql/prisma";
import { Resolver, Query, Args, Mutation, ResolveField, Parent, Int } from "@nestjs/graphql";
import { DepartmentService } from "./department.service";
import { Employee } from "src-nest/prismagraphql/employee";
import { K } from "react-router/dist/development/routeModules-BmVo7q9e";

@Resolver(() => Department)
export class DepartmentResolver {
  constructor(private readonly departmentService: DepartmentService) { }

  @Query(() => Department, { nullable: false })
  findFirstDepartment(@Args() args: FindFirstDepartmentArgs) {
    this.departmentService.findFirst(args);
  }

  @Query(() => Department, { nullable: false })
  findUniqueDepartment(@Args() args: FindUniqueDepartmentArgs) {
    return this.departmentService.findUnique(args);
  }

  @Query(() => [Department], { nullable: false })
  listDepartments(@Args() args: FindManyDepartmentArgs) {
    return this.departmentService.findMany(args);
  }

  @Query(() => [DepartmentGroupBy], { nullable: false })
  groupByDepartment(@Args() args: DepartmentGroupByArgs) {
    return this.departmentService.groupBy(args);
  }

  @Query(() => AggregateDepartment, { nullable: false })
  aggregateDepartment(@Args() args: DepartmentAggregateArgs) {
    return this.departmentService.aggregate(args);
  }

  @Mutation(() => Department, { nullable: true })
  createDepartment(@Args() args: CreateOneDepartmentArgs) {
    return this.departmentService.create(args);
  }

  @Mutation(() => AffectedRows, { nullable: true })
  createManyDepartments(@Args() args: CreateManyDepartmentArgs) {
    return this.departmentService.createMany(args);
  }

  @Mutation(() => Department, { nullable: true })
  updateDepartment(@Args() args: UpdateOneDepartmentArgs) {
    return this.departmentService.update(args);
  }

  @Mutation(() => AffectedRows, { nullable: true })
  updateManyDepartments(@Args() args: UpdateManyDepartmentArgs) {
    return this.departmentService.updateMany(args);
  }

  @Mutation(() => Department, { nullable: true })
  deleteDepartment(@Args() args: DeleteOneDepartmentArgs) {
    return this.departmentService.delete(args);
  }

  @Mutation(() => AffectedRows, { nullable: true })
  deleteManyDepartments(@Args() args: DeleteManyDepartmentArgs) {
    return this.departmentService.deleteMany(args);
  }

  @ResolveField(() => Int)
  employeeCount(@Parent() department: Department) {
    return this.departmentService.prisma.employee.count({
      where: {
        departmentId: department.id,
      }
    });
  }
}