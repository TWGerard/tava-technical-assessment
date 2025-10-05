import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentResolver } from './department.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    DepartmentService,
    PrismaService,
    DepartmentResolver,
  ],
})
export class DepartmentModule { }
