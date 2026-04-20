const express = require('express')
require("dotenv").config();
const app = express();
const fs = require('fs');
const authRoutes = require("./routes/auth");
const passport = require("passport");
require("./config/passport");

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());

app.use('/api', authRoutes);
// Landing page
app.get('/', (req, res) => {
    /// send the static file
    res.sendFile(__dirname + '/public/html/login.html', (err) => {
        if (err){
            console.log(err);
        }
    })
});

// Make a post POST request
app.post('/makepost', function(req, res) {

    // Read in current posts
    const json = fs.readFileSync(__dirname + '/public/json/posts.json');
    var posts = JSON.parse(json);

    // Get the current date
    let curDate = new Date();
    curDate = curDate.toLocaleString("en-GB");

    // Find post with the highest ID
    let maxId = 0;
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].postId > maxId) {
            maxId = posts[i].postId;
        }
    }

    // Initialise ID for a new post
    let newId = 0;

    // If postId is empty, user is making a new post
    if(req.body.postId == "") {
        newId = maxId + 1;
    } else { // If postID != empty, user is editing a post
        newId = req.body.postId;

        // Find post with the matching ID, delete it from posts so user can submit their new version
        let index = posts.findIndex(item => item.postId == newId);
        posts.splice(index, 1);
    }

    // Add post to posts.json
    //this is where the post data can be changed before posting
    //so sanitise at this point
    //and encrypt because we're storing everything as plaintext rn

    let title = req.body.title_field;
    let content = req.body.content_field;

    //Clean the inputs with the sanitisation code
    content = sanitiseInputs(content);
    title = sanitiseInputs(title);


    posts.push({"username": currentUser , "timestamp": curDate, "postId": newId, "title": title, "content": content});
    
    fs.writeFileSync(__dirname + '/public/json/posts.json', JSON.stringify(posts));

    // Redirect back to my_recipes.html
    res.sendFile(__dirname + "/public/html/my_recipes.html");
 });

 // Delete a post POST request
 app.post('/deletepost', (req, res) => {

    // Read in current posts
    const json = fs.readFileSync(__dirname + '/public/json/posts.json');
    var posts = JSON.parse(json);

    // Find post with matching ID and delete it
    let index = posts.findIndex(item => item.postId == req.body.postId);
    posts.splice(index, 1);

    // Update posts.json
    fs.writeFileSync(__dirname + '/public/json/posts.json', JSON.stringify(posts));

    res.sendFile(__dirname + "/public/html/my_recipes.html");
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