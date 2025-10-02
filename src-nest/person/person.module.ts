import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonResolver } from './person.resolver';
import { PrismaService } from '../prisma.service';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';

@Module({
  providers: [
    PersonService,
    EmployeeService,
    PrismaService,
    PersonResolver,
    EmployeeResolver,
  ],
})
export class PersonModule { }
