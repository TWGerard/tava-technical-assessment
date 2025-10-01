import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PeopleService } from './people.service';
import { Person, Prisma } from './prisma/client';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) { }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Person | null> {
    return this.peopleService.findOne(+id);
  }

  @Get()
  async findAll(): Promise<Person[]> {
    return this.peopleService.findAll();
  }

  @Post()
  async create(@Body() personData: Prisma.PersonCreateInput): Promise<Person> {
    return this.peopleService.create(personData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() personData: Prisma.PersonUpdateInput): Promise<Person> {
    return this.peopleService.update(+id, personData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Person> {
    return this.peopleService.remove(+id);
  }
}