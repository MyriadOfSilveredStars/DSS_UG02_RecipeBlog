document.addEventListener("DOMContentLoaded", () => {
    try {
        fetch()
    } catch (error) {
        console.error(error);
        messageElement.textContent = "Something went wrong.";
    }
})