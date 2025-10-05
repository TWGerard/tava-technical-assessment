import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClientKnownRequestError } from './prisma/runtime/library';

@Injectable()
export class BaseCrudService<
  T,
  FindFirstArg,
  FindUniqueArg,
  FindManyArg,
  GroupByArg,
  AggregateArg,
  CreateArg,
  CreateManyArg,
  UpdateArg,
  UpdatedManyArg,
  DeleteArg,
  DeleteManyArg,
> {
  constructor(public prisma: PrismaService) { }

  async findFirst(args: FindFirstArg): Promise<T | null> {
    try {
      return await this.prisma[this.getModelName()].findFirst(args);
    } catch (e) {
      return undefined;
    }
  }
  findUnique(args: FindUniqueArg): Promise<T | null> {
    return this.prisma[this.getModelName()].findUnique(args);
  }

  findMany(args: FindManyArg): Promise<T[]> {
    return this.prisma[this.getModelName()].findMany(args);
  }

  groupBy(args: GroupByArg) {
    return this.prisma[this.getModelName()].groupBy(args);
  }

  aggregate(args: AggregateArg) {
    return this.prisma[this.getModelName()].aggregate(args);
  }

  async create(args: CreateArg): Promise<T> {
    try {
      return await this.prisma[this.getModelName()].create(args);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`${this.getModelName()} with that ${(error.meta.target as string[]).join(' & ')} already exists`);
      }
      throw error;
    }
  }

  createMany(args: CreateManyArg) {
    return this.prisma[this.getModelName()].createMany(args);
  }

  async update(args: UpdateArg): Promise<T> {
    try {
      return await this.prisma[this.getModelName()].update(args);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`${this.getModelName()} with that ${(error.meta.target as string[]).join(' & ')} already exists`);
      }
      throw error;
    }
  }

  updateMany(args: UpdatedManyArg): Promise<T[]> {
    return this.prisma[this.getModelName()].updateMany(args);
  }



  delete(args: DeleteArg): Promise<T> {
    return this.prisma[this.getModelName()].delete(args);
  }

  deleteMany(args: DeleteManyArg): Promise<T[]> {
    return this.prisma[this.getModelName()].deleteMany(args);
  }
  private getModelName(): string {
    return this.constructor.name.replace('Service', '');
  }
}