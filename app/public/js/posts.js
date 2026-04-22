document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const postList = document.getElementById("postsList");

    // Stops server from being overloaded each time a keypress is made during a search
    let searchTimeout = null;

    const loadPosts = async (search = "") => {
        try {
            const response = await fetch(
                `/api/recipes?q=${encodeURIComponent(search)}&limit=10&offset=0`
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.msg || "Failed to load the recipes.");
                return;
            }

            renderPosts(data.recipes);

        } catch (error) {
            console.error("Error loading posts:", error);
        }
    }

    const renderPosts = (recipes) => {
        // Remove previously displayed posts
        postList.querySelectorAll("article").forEach(article => article.remove());
        
        if (!recipes || recipes.length === 0) {
            const msg = document.createElement("p");
            msg.textContent = "No recipes found.";
            postList.appendChild(msg);
            return;
        }
        recipes.forEach(recipe => {
            const article = document.createElement("article");
            article.classList.add("post");

            const fig = document.createElement("figure");
            article.appendChild(fig);

            const img = document.createElement("img");
            img.src = recipe.image_url || "../imgs/default.jpg";
            fig.appendChild(img);

            const figcap = document.createElement("figcaption");
            fig.appendChild(figcap);

            const title = document.createElement("h3");
            title.textContent = recipe.title;
            figcap.appendChild(title);

            const username = document.createElement("h5");
            username.textContent = recipe.username;
            figcap.appendChild(username);

            const time = document.createElement("h5");
            time.textContent = new Date(recipe.created_at).toLocaleString();
            figcap.appendChild(time);

            const summary = document.createElement("p");
            summary.textContent = recipe.summary || "";
            figcap.appendChild(summary);

            const button = document.createElement("button");
            button.textContent = "View Full Recipe";
            button.addEventListener("click", () => {
                window.location.href = `fullrecipe.html?slug=${encodeURIComponent(recipe.slug)}`
            });
            figcap.appendChild(button);

            postList.appendChild(article);
        });
    }
    // Search logic
    if (searchInput) {
        searchInput.addEventListener("input", (evt) => {
            const searchValue = evt.target.value.trim();

            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                loadPosts(searchValue);
            }, 500);
        });
    }
    // Load posts for the first time
    loadPosts();
});