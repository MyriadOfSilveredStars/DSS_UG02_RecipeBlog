document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recipe_form");
    const messageElement = document.getElementById("message");

    form.addEventListener("submit", async (evt) => {
        // stop the page from reloading so that our auth logic can run
        evt.preventDefault();

        const title = document.getElementById("title_input").value.trim();
        const summary = document.getElementById("summary_input").value.trim();
        const image_url = document.getElementById("image_url_input").value.trim();
        const content = document.getElementById("content_input").value.trim();

        const token = localStorage.getItem("token");

        messageElement.textContent = "";

        if(!token) {
            messageElement.textContent = "You must be logged in to edit a post!";
            return;
        }

        // Pull the slug, make sure it exists
        const params = new URLSearchParams(window.location.search);
        const slug = params.get("slug")

        if (!slug) {
            renderMessage("No slug was provided.")
            return;
        }

        try {
            const response = await fetch(`/api/recipes/${encodeURIComponent(slug)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    summary,
                    image_url,
                    content
                })
            });

            const data = await response.json();

            if (!response.ok) {
                messageElement.textContent = data.msg || "Edit failed.";
                return;
            }

            messageElement.textContent = "Your recipe has been edited :)";
            
            form.reset();
        } catch (error) {
            console.error(error);
            messageElement.textContent = "Something went wrong.";
        }
    });
});