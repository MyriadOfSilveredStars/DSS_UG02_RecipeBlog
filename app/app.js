const express = require('express')
require("dotenv").config();
const app = express();
const fs = require('fs');
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const passport = require("passport");
const pool = require('./db');
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

app.post('/makecomment', async (req, res) => {
    const content = req.body.content_field;
    const recipeId = req.body.recipe_id;

    // TEMPORARY hardcoded user (replace later)
    const authorId = 1;

    try {
        await pool.query(
            `INSERT INTO comments (author_id, recipe_id, content)
             VALUES ($1, $2, $3)`,
            [authorId, recipeId, content]
        );

        res.redirect('/html/posts.html');
    } catch (err) {
        console.error('Error saving comment:', err);
        res.status(500).send('Error saving comment');
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Recipes 4 Students is listening on port: ${process.env.PORT}!`)
});


module.exports = app;
