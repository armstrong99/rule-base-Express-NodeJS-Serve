const express = require("express");
const cors = require("cors");
const app = express();

const job = require("./Routes/job.flutter.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(job);

let port = process.env.PORT || 3020;

module.exports = server = () => app.listen(port, () => port);
