document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login_form");
    const messageElement = document.getElementById("message");

    form.addEventListener("submit", async (evt) => {
        // stop the page from reloading so that our auth logic can run
        evt.preventDefault();

        const email = document.getElementById("email_input").value.trim();
        const password = document.getElementById("password_input").value;

        messageElement.textContent = "";

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            if (!response.ok) {
                messageElement.textContent = data.errors?.map(error => error.msg).join(", ") || data.msg || "Login unsuccessful";
                return;
            }
            
            localStorage.setItem("token", data.user.token);
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userName", data.user.username);

            messageElement.textContent = "Login successful!";
            window.location.href = "/html/index.html";
        } catch (error) {
            console.error(error);
            messageElement.textContent = "Something went wrong.";
        }
    });
});