import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PeopleModule } from './people.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [PeopleModule, ConfigModule.forRoot()],
  providers: [PrismaService],
})
export class AppModule { }
