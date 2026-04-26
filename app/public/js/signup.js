document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup_form");
    const messageElement = document.getElementById("message");

    form.addEventListener("submit", async (evt) => {
        // stop the page from reloading so that our auth logic can run
        evt.preventDefault();

        const username = document.getElementById("username_input").value.trim();
        const email = document.getElementById("email_input").value.trim();
        const password = document.getElementById("password_input").value;
        const confirmPassword = document.getElementById("conf_password_input").value;

        messageElement.textContent = "";

        if (password !== confirmPassword) {
            messageElement.textContent = "Passwords don't match.";
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();
            if (!response.ok) {
                messageElement.textContent = data.errors?.map(error => error.msg).join(", ") || data.msg || "User registration unsuccessful";
                return;
            }

            localStorage.setItem("token", data.user.token);
            localStorage.setItem("userName", data.user.username);

            messageElement.textContent = "User account successfully created!"
        } catch (error) {
            console.error(error);
            messageElement.textContent = "Something went wrong.";
        }
    });
});