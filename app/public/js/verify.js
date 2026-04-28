document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("verify_form");
    const messageElement = document.getElementById("message");

    // Retrieve email saved during login step
    const email = localStorage.getItem("pendingEmail");

    form.addEventListener("submit", async (evt) => {
        evt.preventDefault();

        const code = document.getElementById("code_input").value.trim();

        try {
            const response = await fetch("/api/verify-mfa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();

            if (!response.ok) {
                messageElement.textContent = data.msg || "Verification failed.";
                return;
            }

            // MFA passed — store token and proceed
            localStorage.setItem("token", data.user.token);
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userName", data.user.username);
            localStorage.removeItem("pendingEmail");

            window.location.href = "/html/index.html";

        } catch (error) {
            console.error(error);
            messageElement.textContent = "Something went wrong.";
        }
    });
});