process.env.NODE_ENV = "test"

const { default: TestRunner } = require("jest-runner");
const request = require("supertest");
const app = require("../app")
const db = require("../db")

let testCompany;

beforeEach(async function() {
    let result = await db.query(`INSERT INTO companies (code, name, description)
    VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
           ('ibm', 'IBM', 'Big blue.');`);
    testCompany = await db.query('SELECT * FROM companies')
})

afterEach(async function() {
    await db.query('DELETE FROM companies');
});

afterAll(async function() {
    await db.end()
})

describe("GET /companies", function() {
    test("Gets a list of companies", async function() {
      const response = await request(app).get(`/companies`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(testCompany.rows)
    });
  });