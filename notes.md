# Notes

## Development Notes
- I would probably split the frontend and backend repos for a real project. For the purposes of this assessment I am sticking with a single repository.
- Tava uses custom-styled Material UI components. I will begin with default Material UI components and if there's time add Tava-like styles.
- Considering TypeORM or Prisma for an ORM. Prisma has a serverless Postgres variant which sounds appealing.
- I like to create a base Person record which represents a single human being and is referenced by any other records which represent an individual (eg: User or Employee). This allows us to manage People in state on the frontend more effectively and omit frequently repetitive Person serializations from the API. It also allows easy extensibility for future person records such as Patient or Provider while allowing a single Person to have multiple roles.
- Typically I would like my Person and User records to be soft-delete only. I will add this if I have time.
- If there is time it would be nice to add sub-departments (such as the squads on the Engineering team)
- Used official documentation to set up NestJS backend with Prisma ORM using Prisma Postgres
- I ultimately ended up regretting the decision to use NestJS. It was the right call if this was ever going to be a real growing project, but it ate up a lot of my time. For the purposes of this assessment it would have been better to stick with ExpressJS.
- Used Gemini AI to help bootstrap initial endpoints with NestJS and Prisma
- Typically we would have User authentication but I am not going to implement it at the moment
- There's a lot more cleanup that I would like to do here, but I've been working on this for a week now and it's time to submit what I've got
- Would have liked to add pagination
- Test coverage I have implemented is bare minimum. I would normally have started with tests and would have much more coverage.
- I would like to add integration tests with Cypress but I'm out of time
