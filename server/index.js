require('dotenv').config();

const express = require('express');
const path = require('path');

const logger = require('./api/util/logger');
const config = require('./api/util/config');

const authRoute = require('./api/routes/auth.route');

const app = express();

app.use(express.static(path.join(__dirname, '../public/')));

app.use('/auth', authRoute);

app.get('/', (req, res) => {
  res.render('index');
});

app.use((err, req, res, next) => {
  logger.error(error);
  res.status(err.status || 500)
    .send(err.message || 'Internal Server Error');
})

app.listen(config.port, () => {
  logger.info(`PE server is listening on port ${config.port}`);
});
