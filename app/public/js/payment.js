document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("subscribeForm");
    const messageElement = document.getElementById("message");

    form.addEventListener("submit", async (evt) => {
        // stop the page from reloading so that our auth logic can run
        evt.preventDefault();

        const fullName = document.getElementById("fullname_input").value.trim();
        const email = document.getElementById("email_input").value.trim();
        const cardNum = document.getElementById("cardnum_input").value.trim();
        const sortCode = document.getElementById("sortcode_input").value.trim();
        const secCode = document.getElementById("seccode_input").value.trim();

        const token = localStorage.getItem("token");

        messageElement.textContent = "";

        if(!token) {
            messageElement.textContent = "You must be logged in to subscribe!";
            return;
        }

        try {
            const response = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    cardNum,
                    sortCode,
                    secCode
                })
            });

            const data = await response.json();

            if (!response.ok) {
                messageElement.textContent = data.errors?.map(error => error.msg).join(", ") || data.msg || "Post failed.";
                return;
            }
            
            alert("You've subscribed!");
            window.location.href = "index.html";
            
            form.reset();
        } catch (error) {
            console.error(error);
            messageElement.textContent = "Something went wrong.";
        }
    });
});