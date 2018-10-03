const express = require('express');
const authService = require('../services/auth.service');

const router = express.Router();

// Initial page redirecting to Github
router.get('/', (req, res, next) => {
  try {
    const authorizationUri = authService.getAuthorizationUri();
    return res.redirect(authorizationUri);
  } catch (error) {
    next(error);
  }
});

// Callback service parsing the authorization token and asking for the access token
router.get('/callback', (req, res, next) => {
  try {
    const { code } = req.query;
    const successScript = authService.authorize(code);
    return res.send(successScript);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
