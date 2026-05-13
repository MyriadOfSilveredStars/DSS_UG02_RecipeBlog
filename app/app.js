const express = require('express')
require("dotenv").config();
const app = express();
const fs = require('fs');
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const commentRoutes = require("./routes/comments");
const passport = require("passport");
const pool = require('./db');
require("./config/passport");

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());

app.use('/api', authRoutes);
app.use("/api", recipeRoutes);
app.use("/api", commentRoutes);

// Landing page
app.get('/', (req, res) => {
    /// send the static file
    res.sendFile(__dirname + '/public/html/login.html', (err) => {
        if (err){
            console.log(err);
        }
    })
});

app.listen(process.env.PORT, () => {
    console.log(`Recipes 4 Students is listening on port: ${process.env.PORT}!`)
});


module.exports = app;
