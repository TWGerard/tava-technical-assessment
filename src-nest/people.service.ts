import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Person, Prisma } from './prisma/client';

@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) { }

  async findOne(id: number): Promise<Person | null> {
    return this.prisma.person.findUnique({ where: { id } });
  }

  async findAll(): Promise<Person[]> {
    return this.prisma.person.findMany();
  }

  async create(data: Prisma.PersonCreateInput): Promise<Person> {
    return this.prisma.person.create({ data });
  }

  async update(id: number, data: Prisma.PersonUpdateInput): Promise<Person> {
    return this.prisma.person.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Person> {
    return this.prisma.person.delete({ where: { id } });
  }
}