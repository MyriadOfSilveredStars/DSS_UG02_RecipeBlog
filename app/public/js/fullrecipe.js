document.addEventListener("DOMContentLoaded", () => {
    const postList = document.getElementById("postList");


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
                renderMessage(data.msg || "Recipe not found.");
                return;
            }

            renderRecipe(data.recipe);

        } catch(error) {
            console.error(error);
            renderMessage("Something went wrong.");
        }
    }

    const renderRecipe = (recipe) => {
        clearRecipe();

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