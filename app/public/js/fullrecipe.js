async function loadRecipe() {

    //load required data
    const post_response = await fetch("../json/posts.json");
    const post_data = await post_response.json();

    const login_response = await fetch("../json/login_attempt.json");
    const login_data = await login_response.json();

    let postList = document.getElementById('postList');
    let commentList = document.getElementById('commentList');


    for(let i = 0; i < postList.children.length; i++) {
        if(postList.children[i].nodeName == "article") {
            postList.removeChild(postList.children[i]);
        }
    }

    for(let i = 0; i < commentList.children.length; i++) {
        if(commentList.children[i].nodeName == "article") {
            commentList.removeChild(commentList.children[i]);
        }
    }

    //get the post ID from the url
    let params = new URLSearchParams(window.location.search);
    let postId = parseInt(params.get("postID"));
    let recipe = post_data.find(post => post.postId === postId); 

    //check if recipe exists
    if (!recipe) {
        postList.textContent = "Recipe not found.";
        return;
    }

    //add the specific post
    let postAuthor = recipe.username;
    let postTimestamp = recipe.timestamp;
    let postTitle = recipe.title;
    let postContent = recipe.content;

    let postComments = ["this recipe sucks!!", "i substitued everything for air and it came out wrong :(", "i can't eat food, can you make one with my substitutions?"] //replace this with actual comments when implemented

    // Add all recorded posts

    let postContainer = document.createElement('article');
    postContainer.classList.add("post");
    let fig = document.createElement('figure');
    postContainer.appendChild(fig);

    let postIdContainer = document.createElement("p");
    postIdContainer.textContent = postId;
    postIdContainer.hidden = true;
    postIdContainer.id = "postId";
    postContainer.appendChild(postIdContainer);

    let img = document.createElement('img');
    let figcap = document.createElement('figcaption');
    fig.appendChild(img);
    fig.appendChild(figcap);
    
    let titleContainer = document.createElement('h3');
    titleContainer.textContent = postTitle;
    figcap.appendChild(titleContainer);
    
    let usernameContainer = document.createElement('h5');
    usernameContainer.textContent = postAuthor;
    figcap.appendChild(usernameContainer);

    let timeContainer = document.createElement('h5');
    timeContainer.textContent = postTimestamp;
    figcap.appendChild(timeContainer);

    let contentContainer = document.createElement('p');
    contentContainer.textContent = postContent;
    figcap.appendChild(contentContainer);

    //this should make a button to open the recipe in full
    let returnButton = document.createElement('button');
    returnButton.id = "returnButton";
    returnButton.textContent = "All Recipes";

    returnButton.addEventListener("click", returnFunc);
    figcap.appendChild(returnButton);

    postList.appendChild(postContainer)
    
    for (i = 0; i < postComments.length; i++) {

        let commentAuthor = "Comment Author " + String(i);
        let commentTimestamp = "";
        let commentContent = postComments[i];
        let commentId = i;

        let commentContainer = document.createElement('article');
        commentContainer.id = "existingcomment";

        let commentIdContainer = document.createElement("p");
        commentIdContainer.textContent = commentId;
        commentIdContainer.hidden = true;
        commentIdContainer.id = "commentId";
        commentContainer.appendChild(commentIdContainer);
        
        let commenterContainer = document.createElement('h5');
        commenterContainer.textContent = commentAuthor;
        commentContainer.appendChild(commenterContainer);

        let commentTimeContainer = document.createElement('h5');
        commentTimeContainer.textContent = commentTimestamp;
        commentContainer.appendChild(commentTimeContainer);

        let commentContentContainer = document.createElement('p');
        commentContentContainer.textContent = commentContent;
        commentContainer.appendChild(commentContentContainer);

        commentList.appendChild(commentContainer);
    }

        
}



function returnFunc(){
    window.location.href = "posts.html";
}

loadRecipe();