UG02 DSS 02 Coursework

Last Update: 17th March 2026, by Rho

Rho: working on input validation for login, sign up, blog posts etc

Nik: working on authentication for login, sign up, payments

Jay: working on database encryption

Riley: working on logging in and registering with mult. accounts

Everyone: test test test. Write Unit Testing for your sections, comment nicely so we all know what that does. If you use libraries, perhaps add a brief comment on what it does and how it works

NEW:
I have been unable to connect to the database that has been being hosted, and running psql on my pc was making me tear my hair out so I was running on a docker image instead. I've included the yaml file and here are the steps to get it running as I did (locally).

- Make sure you have docker desktop set up
- Pull into new folder
- Navigate to app folder in terminal
- npm install to install all modules
- docker compose up -d
///// Seperate schemas for each table we need. Cleaner and easier to work with. Right now I just have the sql for the user table implemented, and I left schema.sql in tact because it's still valid to use as a base to build other tables from. If you want to add more tables to the db then create the appropriate schema and execute it as you would with the one below
- docker exec -i recipeblog-db psql -U db_2026_cmp_6045b_002_ug02_user -d db_2026_cmp_6045b_002_ug02 < sql/generateUserTable.sql
- docker exec -it recipeblog-db psql -U db_2026_cmp_6045b_002_ug02_user -d db_2026_cmp_6045b_002_ug02
- From here, you can execute psql commands on the db e.g. \dt, \d users for the user table. \q to exit. 
- npm run dev to start server using nodemon
- open the website.
- create an account and log in.
- to reset the database, run "docker compose down" -v followed by "docker compose up -d"

TROUBLESHOOTING: if you run into any fixes for issues and fixes please put them here.
- If password authentication fails for the database you are connected to then the port may already be in use, in which case change it in .yaml and .env

To Run:
- Pull into new folder
- Navigate to app folder in terminal
- npm install to install all modules
- that should install everything but if not, try installing mocha and chai as well
- then use node app.js to run, should say it's listening on port 3000
- ^^ to restart the server automatically after code changes, you can use "npm run dev" to run with nodemon instead. ^^
- localhost 3000 on your browser
- login with "username" and "password"

ISSUES TO FIX:
- username and password are currently the only acceptable login details
- by reloading the page, I was logged out but could still make posts
- before i sanitise the username&password, ensure there's a failsafe so people can't set bad credentials
- literally everything is stored in plaintext 

STUFF TO CONSIDER:
- Users can make recipes and share them
- Users can comment on recipes, like/dislike
- "Trending" recipes will show on the main page
- Users can buyset recipes from the site (?)

