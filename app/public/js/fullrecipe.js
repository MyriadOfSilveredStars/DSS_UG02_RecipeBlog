document.addEventListener("DOMContentLoaded", () => {
    const postList = document.getElementById("postList");
    const commentList = document.getElementById("commentList");


    const loadRecipe = async () => {
        // Pull the slug, make sure it exists
        const params = new URLSearchParams(window.location.search);
        const slug = params.get("slug")

        if (!slug) {
            renderMessage("No slug was provided.")
            return;
        }

        try {
            const response = await fetch(`/api/recipes/${encodeURIComponent(slug)}`);
            const data = await response.json();
            if (!response.ok) {
                renderMessage(data.errors?.map(error => error.msg).join(", ") || data.msg || "Recipe not found.");
                return;
            }

            renderRecipe(data.recipe);
            loadComments(data.recipe.id);

        } catch(error) {
            console.error(error);
            renderMessage("Something went wrong.");
        }
    }

    const loadComments = async (recipeId) => {
    commentList.innerHTML = "";

        try {
            const response = await fetch(`/api/recipes/${recipeId}/comments`);
            const data = await response.json();

            if (!response.ok) {
                commentList.textContent = "Could not load comments.";
                return;
            }

            if (!data.comments || data.comments.length === 0) {
                commentList.textContent = "No comments yet.";
                return;
        }

        data.comments.forEach(comment => {
            const article = document.createElement("article");
            article.classList.add("comment");

            const username = document.createElement("h4");
            username.textContent = comment.username || "Unknown user";

            const content = document.createElement("p");
            content.textContent = comment.content;

            const date = document.createElement("small");
            date.textContent = new Date(comment.created_at).toLocaleString();

            article.appendChild(username);
            article.appendChild(content);
            article.appendChild(date);

            commentList.appendChild(article);
        });

    } catch (error) {
        console.error(error);
        commentList.textContent = "Something went wrong loading comments.";
    }
    };
    
    const renderRecipe = (recipe) => {
        clearRecipe();

        const postIdInput = document.getElementById("postId");
        if (postIdInput) {
            postIdInput.value = recipe.id;
        }

        const article = document.createElement("article");
        article.classList.add("post");

        const fig = document.createElement("figure");
        article.appendChild(fig);

        const img = document.createElement("img");
        img.src = recipe.image_url || "../imgs/default.jpg";
        img.alt = recipe.title || "What should be a recipe.";
        fig.appendChild(img);

        const figcap = document.createElement("figcaption");
        fig.appendChild(figcap);

        const title = document.createElement("h2");
        title.textContent = recipe.title;
        figcap.appendChild(title);

        const username = document.createElement("h5");
        username.textContent = recipe.username;
        figcap.appendChild(username);

        const time = document.createElement("h5");
        time.textContent = new Date(recipe.created_at).toLocaleString();
        figcap.appendChild(time);

        if (recipe.summary) {
            const summary = document.createElement("p");
            summary.textContent = recipe.summary;
            figcap.appendChild(summary);
        }

        const content = document.createElement("p");
        // This shouldn't ever return empty, but just in case.
        content.textContent = recipe.content || "";
        figcap.appendChild(content);

        postList.appendChild(article);
    };

    const renderMessage = (message) => {
        clearRecipe();
        const msg = document.createElement("p");
        msg.textContent = message;
        postList.appendChild(msg);
    };

    const clearRecipe = () => {
        postList.querySelectorAll("article, p").forEach(element => element.remove());
    };

    loadRecipe();
});