let subscribeButton = document.getElementById("subscribe_btn");
subscribeButton.addEventListener("click", () => subscribeConfirm());


function subscribeConfirm(){
    alert("You've subscribed!");

    //this is where we update the user's status in the database
    //from unpaid to paid
    //but also to store their payment information
    //encrypted, of course

    window.location.href = "paidrecipes.html";

}