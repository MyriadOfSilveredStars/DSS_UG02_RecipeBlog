//const app = require("../app/app");
//const request = require("supertest")(app)
const sinon = require("sinon");
const assert = require("assert");
const { expect } = require("chai");
const pool = require("../app/db");

const authController = require('../app/controllers/auth');
const register = authController.register;

//const auth = require('../app/routes/auth');
//const request = require('supertest')(auth);

const {
    createComment,
    getCommentsByRecipe
} = require("../app/controllers/comments");

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

describe("Comments Controller", () => {

    afterEach(() => {
        sinon.restore();
    });

    describe("createComment", () => {
        it("should create a comment successfully", async () => {
            const req = {
                body: {
                    recipe_id: 5,
                    content: "Great recipe!"
                },
                user: {
                    id: 2
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            const mockComment = {
                id: 10,
                author_id: 2,
                recipe_id: 5,
                content: "Great recipe!"
            };
            sinon.stub(pool, "query").resolves({
                rows: [mockComment]
            });
            await createComment(req, res);
            expect(pool.query.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({
                comment: mockComment
            })).to.be.true;
        });

        it("should return 500 if database insert fails", async () => {
            const req = {
                body: {
                    recipe_id: 5,
                    content: "Great recipe!"
                },
                user: {
                    id: 2
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            sinon.stub(pool, "query").rejects(new Error("DB error"));
            await createComment(req, res);
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({
                msg: "Failed to save comment."
            })).to.be.true;
        });

    });

    describe("getCommentsByRecipe", () => {
        it("should return comments for a recipe", async () => {
            const req = {
                params: {
                    id: 5
                }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
            const mockComments = [
                {
                    id: 1,
                    content: "Nice recipe!",
                    username: "jaygroom"
                }
            ];
            sinon.stub(pool, "query").resolves({
                rows: mockComments
            });
            await getCommentsByRecipe(req, res);
            expect(pool.query.calledOnce).to.be.true;
            expect(res.json.calledWith({
                comments: mockComments
            })).to.be.true;
        });

        it("should return 500 if fetching comments fails", async () => {
            const req = {
                params: {
                    id: 5
                }
            };
            const res = {
                json: sinon.spy(),
                status: sinon.stub().returnsThis()
            };
            sinon.stub(pool, "query").rejects(new Error("DB error"));
            await getCommentsByRecipe(req, res);
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({
                msg: "Failed to load comments."
            })).to.be.true;
        });
    });
});