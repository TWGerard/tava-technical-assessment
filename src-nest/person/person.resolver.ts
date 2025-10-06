import {
  Person,
  FindFirstPersonArgs,
  FindUniquePersonArgs,
  FindManyPersonArgs,
  PersonGroupBy,
  PersonGroupByArgs,
  AggregatePerson,
  PersonAggregateArgs,
  CreateOnePersonArgs,
  CreateManyPersonArgs,
  UpdateOnePersonArgs,
  UpdateManyPersonArgs,
  DeleteOnePersonArgs,
  DeleteManyPersonArgs,
} from "../prismagraphql/person";
import { AffectedRows } from "../prismagraphql/prisma";
import { Resolver, Query, Args, Mutation, ResolveField, Parent } from "@nestjs/graphql";
import { PersonService } from "./person.service";
import { Employee } from "../prismagraphql/employee";
import { User } from "../prismagraphql/user";

@Resolver(() => Person)
export class PersonResolver {
  constructor(private readonly personService: PersonService) { }

  @Query(() => Person, { nullable: false })
  findFirstPerson(@Args() args: FindFirstPersonArgs) {
    this.personService.findFirst(args);
  }

  @Query(() => Person, { nullable: false })
  findUniquePerson(@Args() args: FindUniquePersonArgs) {
    return this.personService.findUnique(args);
  }

  @Query(() => [Person], { nullable: false })
  listPeople(@Args() args: FindManyPersonArgs) {
    return this.personService.findMany(args);
  }

  @Query(() => [PersonGroupBy], { nullable: false })
  groupByPerson(@Args() args: PersonGroupByArgs) {
    return this.personService.groupBy(args);
  }

  @Query(() => AggregatePerson, { nullable: false })
  aggregatePerson(@Args() args: PersonAggregateArgs) {
    return this.personService.aggregate(args);
  }

  @Mutation(() => Person, { nullable: true })
  createPerson(@Args() args: CreateOnePersonArgs) {
    return this.personService.create(args);
  }

  @Mutation(() => AffectedRows, { nullable: true })
  createManyPeople(@Args() args: CreateManyPersonArgs) {
    return this.personService.createMany(args);
  }

  @Mutation(() => Person, { nullable: true })
  updatePerson(@Args() args: UpdateOnePersonArgs) {
    return this.personService.update(args);
  }

  @Mutation(() => AffectedRows, { nullable: true })
  updateManyPeople(@Args() args: UpdateManyPersonArgs) {
    return this.personService.updateMany(args);
  }

  @Mutation(() => Person, { nullable: true })
  deletePerson(@Args() args: DeleteOnePersonArgs) {
    return this.personService.delete(args);
  }

  @Mutation(() => AffectedRows, { nullable: true })
  deleteManyPeople(@Args() args: DeleteManyPersonArgs) {
    return this.personService.deleteMany(args);
  }

  @ResolveField(() => Employee)
  employee(@Parent() person: Person) {
    return this.personService.prisma.employee.findUnique({ where: { personId: person.id } });
  }

  @ResolveField(() => User)
  user(@Parent() person: Person) {
    return this.personService.prisma.user.findUnique({ where: { personId: person.id } });
  }
}