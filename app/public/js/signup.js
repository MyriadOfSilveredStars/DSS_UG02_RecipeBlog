function showSignupError(message) {
    const existing = document.getElementById("signup_error");
    if (existing) existing.remove();

    let error_msg = document.createElement("p");
    error_msg.id = "signup_error";
    error_msg.textContent = message;
    error_msg.classList.add("error");
    document.querySelector("#signup_btn").parentNode.insertBefore(error_msg, document.querySelector("#signup_btn"));
}

const params = new URLSearchParams(window.location.search);

// ensuring that error message always says username OR password to prevent helping a hacker
if (params.get("error")) {
    showLoginError("Invalid username or password");
}