function showLoginError(message) {
    const existing = document.getElementById("login_error");
    if (existing) existing.remove();

    let error_msg = document.createElement("p");
    error_msg.id = "login_error";
    error_msg.textContent = message;
    error_msg.classList.add("error");
    document.querySelector("#login_btn").parentNode.insertBefore(error_msg, document.querySelector("#login_btn"));
}

const params = new URLSearchParams(window.location.search);

// ensuring that error message always says username OR password to prevent helping a hacker
if (params.get("error")) {
    showLoginError("Incorrect username or password.");
}