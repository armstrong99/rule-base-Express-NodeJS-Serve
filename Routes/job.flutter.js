const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const { validateJson } = require("../Middlewares/validateJson");

let job = express.Router();

let { profile, validate_rule } = require("../Controllers/job.controller.js");

job.get("/", profile);

job.post("/validate-rule", validateJson, validate_rule);

module.exports = job;
