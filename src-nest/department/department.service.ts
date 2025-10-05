import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { BaseCrudService } from "../base.service";
import {
  CreateManyDepartmentArgs,
  CreateOneDepartmentArgs,
  DeleteManyDepartmentArgs,
  DeleteOneDepartmentArgs,
  FindFirstDepartmentArgs,
  FindManyDepartmentArgs,
  FindUniqueDepartmentArgs,
  UpdateManyDepartmentArgs,
  UpdateOneDepartmentArgs,
  Department,
  DepartmentAggregateArgs,
  DepartmentGroupByArgs,
} from "../prismagraphql/department";

@Injectable()
export class DepartmentService extends BaseCrudService<
  Department,
  FindFirstDepartmentArgs,
  FindUniqueDepartmentArgs,
  FindManyDepartmentArgs,
  DepartmentGroupByArgs,
  DepartmentAggregateArgs,
  CreateOneDepartmentArgs,
  CreateManyDepartmentArgs,
  UpdateOneDepartmentArgs,
  UpdateManyDepartmentArgs,
  DeleteOneDepartmentArgs,
  DeleteManyDepartmentArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}