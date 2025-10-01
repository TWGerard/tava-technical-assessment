import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonResolver } from './person.resolver';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    PersonService,
    PrismaService,
    PersonResolver,
  ],
})
export class PersonModule { }
