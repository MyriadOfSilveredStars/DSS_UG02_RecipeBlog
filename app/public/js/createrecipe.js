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
        const subscriber_only = document.getElementById("subscriber_only_input").checked;

        const token = localStorage.getItem("token");

        messageElement.textContent = "";

        if(!token) {
            messageElement.textContent = "You must be logged in to make a post!";
            return;
        }

        try {
            const response = await fetch("/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    summary,
                    image_url,
                    content,
                    subscriber_only
                })
            });

            const data = await response.json();

            if (!response.ok) {
                messageElement.textContent = data.errors?.map(error => error.msg).join(", ") || data.msg || "Post failed.";
                return;
            }

            messageElement.textContent = "Your recipe has been published :)";
            
            form.reset();
        } catch (error) {
            console.error(error);
            messageElement.textContent = "Something went wrong.";
        }
    });
});