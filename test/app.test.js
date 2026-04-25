const assert = require('assert');

const authController = require('../app/controllers/auth');
const register = authController.register;

const recipeController = require("../app/controllers/recipes");

//variables to use in testing
var username = "";
var password = "password1234";
var email = "johndoe@yellowking.com"



describe("Testing User Sign Up", function (){

    it("blank fields should return error code 422", function(){
        const testdata = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            };

        var res = register(testdata);
        assert.strictEqual(res, 422);

    });

    it("if the user exists, it should return error code 409", function(){

    })

});