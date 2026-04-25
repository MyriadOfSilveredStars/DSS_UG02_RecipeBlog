UG02 DSS 02 Coursework

Last Update: 22nd April 2026, by Rho

Rho: working on input validation for login, sign up, blog posts etc, sql injection prevention

Nik: working on authentication for login, sign up, payments

Jay: working on database encryption

Riley: working on logging in and registering with mult. accounts

Everyone: test test test. Write Unit Testing for your sections, comment nicely so we all know what that does. If you use libraries, perhaps add a brief comment on what it does and how it works

TO RUN:
- Pull into new folder
- Navigate to app folder in terminal
- npm install to install all modules
- that should install everything but if not, try installing mocha and chai as well
- then use node app.js to run, should say it's listening on port 3000
- use npm run dev or npm start to run with nodemon instead
- localhost 3000 on your browser
- sign up and login with whatever details you want

TO DO NEXT:
- time to figure out mocha and chai with node
- i think the trending & index page is still reading from the json, so it should read from the database instead
- remove full name from user table, because otherwise we can't make users (current logic doesn't provide full name, triggering a null-constraint error)


TROUBLESHOOTING: if you run into any fixes for issues and fixes please put them here.
- If password authentication fails for the database you are connected to then the port may already be in use, in which case change it in .yaml and .env
- If it isn't running, check that you aren't being stupid like me (rho) and: leave the app folder, use npm start instead
- If it says "einuse" or something, go to the .env file and change the PORT. I (rho) use 3001

RILEY DATABASE DOCKER:
I have been unable to connect to the database that has been being hosted, and running psql on my pc was making me tear my hair out so I was running on a docker image instead. I've included the yaml file and here are the steps to get it running as I did (locally).

- Make sure you have docker desktop set up
- Pull into new folder
- Navigate to app folder in terminal
- npm install to install all modules
- docker compose up -d
  
NOTE: I separated schemas for each table we need. Cleaner and easier to work with. Right now I just have the sql for the user table implemented, and I left schema.sql in tact because it's still valid to use as a base to build other tables from. If you want to add more tables to the db then create the appropriate schema and execute it as you would with the one below
- docker exec -i recipeblog-db psql -U db_2026_cmp_6045b_002_ug02_user -d db_2026_cmp_6045b_002_ug02 < sql/generateUserTable.sql
- docker exec -i recipeblog-db psql -U db_2026_cmp_6045b_002_ug02_user -d db_2026_cmp_6045b_002_ug02 < sql/generateRecipeTable.sql
- docker exec -it recipeblog-db psql -U db_2026_cmp_6045b_002_ug02_user -d db_2026_cmp_6045b_002_ug02
- From here, you can execute psql commands on the db e.g. \dt, \d users for the user table. \q to exit. 
- npm run dev to start server using nodemon
- open the website.
- create an account and log in.
- to reset the database, run "docker compose down" -v followed by "docker compose up -d"