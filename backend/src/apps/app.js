const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use("/", require(`${__dirname}/../routers/web`));
app.set("json spaces", 2); 

module.exports = app;