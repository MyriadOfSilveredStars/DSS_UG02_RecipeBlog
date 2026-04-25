document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const postList = document.getElementById("postsList");

    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    const pageNumber = document.getElementById("pageNumber");

    let currentPage = 1;
    const limit = 10;

    // Stops server from being overloaded each time a keypress is made during a search
    let searchTimeout = null;

    const loadPosts = async (search = "", page = 1) => {
        try {
            const offset = (page - 1) * limit;
            const response = await fetch(
                `/api/recipes?q=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}`
            );


            const data = await response.json();

            if (!response.ok) {
                console.error(data.msg || "Failed to load the recipes.");
                return;
            }

            renderPosts(data.recipes);
            
            pageNumber.textContent = `Page ${page}`;
            // Can't go back on the first page
            prevButton.disabled = page === 1;
            // If there are less than 10 pages 
            nextButton.disabled = !data.hasNextPage;

        } catch (error) {
            console.error("Error loading posts:", error);
        }
    }

    const renderPosts = (recipes) => {
        // Remove previously displayed posts
        postList.querySelectorAll("article").forEach(article => article.remove());
        // Remove No Recipes message
        const messageToRemove = document.getElementById("bogusSearchMessage");
        if (messageToRemove) {
            messageToRemove.remove();
        }
        
        if (!recipes || recipes.length === 0) {
            const msg = document.createElement("p");
            msg.id = "bogusSearchMessage";
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
            img.alt = recipe.title || "What should be a recipe.";
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
                
                loadPosts(searchValue, currentPage);
            }, 500);
        });
    }
    
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadPosts(searchInput.value.trim(), currentPage);
        }
    });
    nextButton.addEventListener("click", () => {
        currentPage++
        loadPosts(searchInput.value.trim(), currentPage);
    })

    // Load posts for the first time
    loadPosts("", currentPage);
});