const app = require("../app/app");
const request = require("supertest")(app)
const assert = require("assert");


const registeruser = require("../app/controllers/auth").register;
const loginuser = require("../app/controllers/auth").login;
const dashboard = require("../app/controllers/auth").dashboard;

const dashboard_request = require("supertest")(dashboard);

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

describe('Check Connection', function() {

    it("Connects to app.js", function(done) {
        request
            .get('/')
            .expect(200, done);
    });

    it("Connects to auth dashboard", function(done){
        dashboard_request
        .get('/')
        .expect(200, done);
    })

});

describe("Signing Up", () => {
    it("on the verge", async () => {
        const res = await request(registeruser).get('/', testdata).expect(200);
    });
});

describe("Dashboard", () => {
    it("i am near death", async () => {
        const res = await request(dashboard).get('/').expect(200);
    });
})

