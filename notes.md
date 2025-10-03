# Notes

## Development Notes
- I would probably split the frontend and backend repos for a real project. For the purposes of this assessment I am sticking with a single repository.
- Tava uses custom-styled Material UI components. I will begin with default Material UI components and if there's time add Tava-like styles.
- Considering TypeORM or Prisma for an ORM. Prisma has a serverless Postgres variant which sounds appealing.
- I like to create a base Person record which represents a single human being and is referenced by any other records which represent an individual (eg: User or Employee). This allows us to manage People in state on the frontend more effectively and omit frequently repetitive Person serializations from the API. It also allows easy extensibility for future person records such as Patient or Provider while allowing a single Person to have multiple roles.
- Typically I would like my Person and User records to be soft-delete only. I will add this if I have time.
- If there is time it would be nice to add sub-departments (such as the squads on the Engineering team)
- It would also be nice to add some kind 
- Used official documentation to set up NestJS backend with Prisma ORM using Prisma Postgres
- Used Gemini AI to help bootstrap initial endpoints with NestJS and Prisma
- Typically we would have User authentication but I am not going to implement it at the moment
- It would be nice to add a React table library but I'll just stick with something simple for now
