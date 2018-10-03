const express = require('express');
const authService = require('../services/auth.service');

const router = express.Router();

// Initial page redirecting to Github
router.get('/', (req, res) => {
  const authorizationUri = authService.getAuthorizationUri();
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
router.get('/callback', (req, res) => {
  const { code } = req.query;
  const successScript = authService.authorize(code);
  return res.send(successScript);
});

module.exports = router;
