//Function to sanitise inputs from the user
const sanitise = function sanitiseInputs(inputs) {
    //uses regex to remove all instances of "bad" inputs
    //such as html tags and other key words
    //the regex expression will probably grow overtime

    const badInputs = "<[^>]*>"; //regex currently removes all html tags
    inputs = inputs.replace(new RegExp(badInputs, 'g'), "");
    
    return inputs;
}

module.exports = sanitise;

//if anyone knows how to import this function into app.js that would be awesome saucesome
//currently it's just copied in at the bottom because i couldn't figure it out
//but i want a separate file to keep the code neat