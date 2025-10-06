import { PersonResolver } from "./person.resolver";
import { PersonService } from "./person.service";
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../prisma.service";


describe('PersonResolver', () => {
  let prismaService: PrismaService;
  let personService: PersonService;
  let personResolver: PersonResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: PrismaService,
          useValue: {},
        },
        PersonResolver,
      ]
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    personService = module.get<PersonService>(PersonService);
    personResolver = module.get<PersonResolver>(PersonResolver);
  });

  describe('listPersons', () => {
    it('should return an array of Persons', async () => {
      const result = [{
        id: 1,
        firstName: "Test",
        lastName: "Person",
        email: null,
        phone: null
      }];
      jest.spyOn(personService, 'findMany').mockImplementation(async () => result);
      expect(await personResolver.listPeople({})).toBe(result);
    });
  });
});
