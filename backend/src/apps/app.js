const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const path = require('path');
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use("/", require(`${__dirname}/../routers/web`));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

module.exports = app;