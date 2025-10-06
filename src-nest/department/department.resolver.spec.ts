import { DepartmentResolver } from "./department.resolver";
import { DepartmentService } from "./department.service";
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../prisma.service";


describe('DepartmentResolver', () => {
  let prismaService: PrismaService;
  let departmentService: DepartmentService;
  let departmentResolver: DepartmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: PrismaService,
          useValue: {},
        },
        DepartmentResolver,
      ]
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    departmentService = module.get<DepartmentService>(DepartmentService);
    departmentResolver = module.get<DepartmentResolver>(DepartmentResolver);
  });

  describe('listDepartments', () => {
    it('should return an array of Departments', async () => {
      const result = [{
        id: 1,
        name: "Test Department",
      }];
      jest.spyOn(departmentService, 'findMany').mockImplementation(async () => result);
      expect(await departmentResolver.listDepartments({})).toBe(result);
    });
  });
});
