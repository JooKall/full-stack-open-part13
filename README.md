# Full stack open: relational database

My choice for setting up the database was Docker.

**Make a Postgres database using Docker. This creates a volume (-v) for persistent data storage.**  
`docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -v my_postgres_data:/var/lib/postgresql/data postgres`

**Open a terminal inside the Postgres container.**  
**Use the `postgres` user to connect to the default database.**  
`docker exec -it my-postgres psql -U postgres postgres`

**Create a .env file and add the database connection string to it.**  
`DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres`

**Shutdown.**  
`docker kill my-postgres`

**Start an existing container.**  
without logs: `docker start my-postgres`  
with logs: `docker start -a my-postgres`

**List all running containers.**  
`docker ps`

**List all containers.**  
`docker ps -a`



