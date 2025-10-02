import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { BaseCrudService } from "../base.service";
import {
  CreateManyEmployeeArgs,
  CreateOneEmployeeArgs,
  DeleteManyEmployeeArgs,
  DeleteOneEmployeeArgs,
  FindFirstEmployeeArgs,
  FindManyEmployeeArgs,
  FindUniqueEmployeeArgs,
  UpdateManyEmployeeArgs,
  UpdateOneEmployeeArgs,
  Employee,
  EmployeeAggregateArgs,
  EmployeeGroupByArgs,
} from "../prismagraphql/employee";

@Injectable()
export class EmployeeService extends BaseCrudService<
  Employee,
  FindFirstEmployeeArgs,
  FindUniqueEmployeeArgs,
  FindManyEmployeeArgs,
  EmployeeGroupByArgs,
  EmployeeAggregateArgs,
  CreateOneEmployeeArgs,
  CreateManyEmployeeArgs,
  UpdateOneEmployeeArgs,
  UpdateManyEmployeeArgs,
  DeleteOneEmployeeArgs,
  DeleteManyEmployeeArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}