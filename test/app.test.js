//const app = require("../app/app");
//const request = require("supertest")(app)
const assert = require("assert");

const authController = require('../app/controllers/auth');
const register = authController.register;

//const auth = require('../app/routes/auth');
//const request = require('supertest')(auth);

//sanitisation
const sanitisation = require('../app/public/js/sanitisation');

//variables to use in testing
var username = "johndoe";
var password = "password1234";
var email = "johndoe@yellowking.com"

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

//let the testing begin
/* 
describe('Check Connection to App', function() {

    //this test works
    it("Connects to app.js", function(done) {
        request
            .get('/')
            .expect(200, done);
    });

});


//I HAVE IT
//i did not in fact have it
// i can send data TO the auth.js controller, but not get status codes back
// that's about it actually it doesn't run if i call it with supertest
// my console uses bash because this coursework makes me want to bash my head against a rock

describe('Test registering a new user', function() {
    it ("Should return code 422 for missing information", async function() {

        request
        .get('/api/register')
        .expect(422);
    })
})

*/

describe('Testing the sanitisation', function(){
    it("Should have no < or >", function(){
        let testInput = "<html> there were tags here </html>";
        let expected = " there were tags here ";
        testInput = sanitisation(testInput);
        assert.strictEqual(testInput, expected)
    })

    it("So long as there's an enclosing <> pair, the innards will be removed", function(){
        let testInput = "<html<<<<>> ad wao>> there were tags here </html>";
        let expected = "> ad wao>> there were tags here ";
        testInput = sanitisation(testInput);
        assert.strictEqual(testInput, expected)
    })

    it("Should reject XSS attempt", function(){
        let malCode = "<script> alert('START RUNNING') </script>";
        let expected = " alert('START RUNNING') ";
        malCode = sanitisation(malCode);
        assert.strictEqual(malCode, expected);
    })
})

