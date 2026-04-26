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
