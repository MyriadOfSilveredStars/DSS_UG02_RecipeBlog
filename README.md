UG02 DSS 02 Coursework

Last Update: 17th March 2026, by Rho

Rho: working on input validation for login, sign up, blog posts etc

Nik: working on authentication for login, sign up, payments

Jay: working on database encryption

Riley: working on <insert whatever you want to work on here :)>

Everyone: test test test. Write Unit Testing for your sections, comment nicely so we all know what that does. If you use libraries, perhaps add a brief comment on what it does and how it works

To Run:
- Download the front end from BlackBoard.
- Extract and locate the node_modules bit
- Put into local folder and link to this GitHub
- Pull
- Navigate to app folder in terminal
- npm install to install all modules
- that should install everything but if not, try installing mocha and chai as well
- then use node app.js to run, should say it's listening on port 3000
- localhost 3000 on your browser
- login with "username" and "password"

ISSUES TO FIX:
- username and password are currently the only acceptable login details
- by reloading the page, I was logged out but could still make posts
- before i sanitise the username&password, ensure there's a failsafe so people can't set bad credentials
- literally everything is stored in plaintext 

