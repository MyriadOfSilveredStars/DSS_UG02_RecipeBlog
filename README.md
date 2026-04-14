UG02 DSS 02 Coursework

Last Update: 17th March 2026, by Rho

Rho: working on input validation for login, sign up, blog posts etc

Nik: working on authentication for login, sign up, payments

Jay: working on database encryption

Riley: working on logging in and registering with mult. accounts

Everyone: test test test. Write Unit Testing for your sections, comment nicely so we all know what that does. If you use libraries, perhaps add a brief comment on what it does and how it works

To Run:
- Pull into new folder
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

STUFF TO CONSIDER:
- Users can make recipes and share them
- Users can comment on recipes, like/dislike
- "Trending" recipes will show on the main page
- Users can buyset recipes from the site (?)

