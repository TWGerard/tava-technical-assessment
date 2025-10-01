import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { BaseCrudService } from "./base.service";
import {
  CreateManyPersonArgs,
  CreateOnePersonArgs,
  DeleteManyPersonArgs,
  DeleteOnePersonArgs,
  FindFirstPersonArgs,
  FindManyPersonArgs,
  FindUniquePersonArgs,
  UpdateManyPersonArgs,
  UpdateOnePersonArgs,
  Person,
  PersonAggregateArgs,
  PersonGroupByArgs,
} from "./prismagraphql/person";

@Injectable()
export class PersonService extends BaseCrudService<
  Person,
  FindFirstPersonArgs,
  FindUniquePersonArgs,
  FindManyPersonArgs,
  PersonGroupByArgs,
  PersonAggregateArgs,
  CreateOnePersonArgs,
  CreateManyPersonArgs,
  UpdateOnePersonArgs,
  UpdateManyPersonArgs,
  DeleteOnePersonArgs,
  DeleteManyPersonArgs
> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}