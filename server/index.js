require('dotenv').config();

const express = require('express');
const path = require('path');

const logger = require('./util/logger');

const app = express();

app.use(express.static(path.join(__dirname, '../public/')));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(8080, () => {
  logger.info(`PE server is listening on port ${8080}`);
});
