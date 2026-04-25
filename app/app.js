const express = require('express')
require("dotenv").config();
const app = express();
const fs = require('fs');
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const passport = require("passport");
require("./config/passport");

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());

app.use('/api', authRoutes);
app.use("/api", recipeRoutes);

// Landing page
app.get('/', (req, res) => {
    /// send the static file
    res.sendFile(__dirname + '/public/html/login.html', (err) => {
        if (err){
            console.log(err);
        }
    })
});

app.post('/makecomment', (req, res) => {
    //blaraghargh
    //gab gnglaoohhlaaaaaarghhhhhhhaaaaaaaaaaaaaaaanhhophphna       aaaaaaaaaaaaaahaaa
    // Get the current date
    let curDate = new Date();
    curDate = curDate.toLocaleString("en-GB");

    let content = req.body.content_field;

    //Clean the inputs with the sanitisation code
    content = sanitiseInputs(content);

    //write this to the database

    // Redirect back to my_recipes.html
    res.sendFile(__dirname + "/public/html/posts.html");


});


app.listen(process.env.PORT, () => {
    console.log(`Recipes 4 Students is listening on port: ${process.env.PORT}!`)
});



function sanitiseInputs(inputs) {
    //uses regex to remove all instances of "bad" inputs
    //such as html tags and other key words
    //the regex expression will probably grow overtime

    const badInputs = "<[^>]*>"; //regex currently removes all html tags
    inputs = inputs.replace(new RegExp(badInputs, 'g'), "");
    
    return inputs;
}