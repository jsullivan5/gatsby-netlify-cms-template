require('dotenv').config();

const express = require('express');
const path = require('path');

const logger = require('./util/logger');
const config = require('./util/config');

const authRoute = require('./routes/authenticate.route');

const app = express();

app.use(express.static(path.join(__dirname, '../public/')));

app.use('/authenticate', authRoute);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(config.port, () => {
  logger.info(`PE server is listening on port ${config.port}`);
});
