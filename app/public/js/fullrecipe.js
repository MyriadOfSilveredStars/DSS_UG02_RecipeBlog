async function loadRecipe() {

    //load required data
    const post_response = await fetch("../json/posts.json");
    const post_data = await post_response.json();

    const login_response = await fetch("../json/login_attempt.json");
    const login_data = await login_response.json();

    let postList = document.getElementById('postList');
    let commentList = document.getElementById('commentList');

    let specificRecipeID = 17; //this is a placeholder

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

    //add the specific post
    let postAuthor = post_data[specificRecipeID].username;
    let postTimestamp = post_data[specificRecipeID].timestamp;
    let postTitle = post_data[specificRecipeID].title;
    let postContent = post_data[specificRecipeID].content;
    let postId = specificRecipeID;

    let postComments = ["this recipe sucks!!", "i substitued everything for air and it came out wrong :(", "i can't eat food, can you make one with my substitutions?"] //replace this with actual comments when implemented

    // Add all recorded posts

    let postContainer = document.createElement('article');
    postContainer.classList.add("post");
    let fig = document.createElement('figure');
    postContainer.appendChild(fig);

    let postIdContainer = document.createElement("p");
    postIdContainer.textContent = postId;
    postIdContainer.hidden = true;
    postId.id = "postId";
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

        let commentContainer = document.createElement('commentarticle');
        commentContainer.classList.add("comment");
        let commentFig = document.createElement('commentfigure');
        commentContainer.appendChild(commentFig);

        let commentIdContainer = document.createElement("p");
        commentIdContainer.textContent = commentId;
        commentIdContainer.hidden = true;
        commentId.id = "commentId";
        commentContainer.appendChild(commentIdContainer);

        let commentImg = document.createElement('img');
        let commentfigcap = document.createElement('commentfigcaption');
        commentFig.appendChild(commentImg);
        commentFig.appendChild(commentfigcap);
        
        let commenterContainer = document.createElement('h5');
        commenterContainer.textContent = commentAuthor;
        commentfigcap.appendChild(commenterContainer);

        let commentTimeContainer = document.createElement('h5');
        commentTimeContainer.textContent = commentTimestamp;
        commentfigcap.appendChild(commentTimeContainer);

        let commentContentContainer = document.createElement('p');
        commentContentContainer.textContent = commentContent;
        commentfigcap.appendChild(commentContentContainer);

        commentList.appendChild(commentContainer);
    }

        
}



function returnFunc(){
    window.location.href = "posts.html";
}

loadRecipe();