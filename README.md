UG02 DSS 02 Coursework

Last Update: 28th April 2026, by Rho & Nik

Rho: working on input validation for login, sign up, blog posts etc. plus client flyer

Nik: working on authentication for login, sign up, payments, mfa

Jay: working on database encryption, working comments on posts

Riley: working on logging in and registering with mult. accounts, general fixes

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
- user testing (rho has this handled)
- unit testing (rho is bashing their skull open)
- pen testing (?) can we do that can we pen test?
- discuss client flyer contents vs demo contents

TROUBLESHOOTING: if you run into any fixes for issues and fixes please put them here.
- If password authentication fails for the database you are connected to then the port may already be in use, in which case change it in .yaml and .env
- If it isn't running, check that you aren't being stupid like me (rho) and: leave the app folder, use npm start instead
- If it says "einuse" or something, go to the .env file and change the PORT. I (rho) use 3001
