const express = require('express');
const logger = require('../util/logger');
const config = require('../util/config');

const simpleOauthModule = require('simple-oauth2');
const randomstring = require('randomstring');

const router = express.Router();


const oauth_provider = config.oauthProvider;
const login_auth_target = config.loginAuthTarget;

const oauth2 = simpleOauthModule.create({
  client: {
    id: config.clientId,
    secret: config.clientSecret
  },
  auth: {
    // Supply GIT_HOSTNAME for enterprise github installs.
    tokenHost: config.gitHostname,
    tokenPath: config.tokenPath,
    authorizePath: config.authorizePath
  }
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: config.redirectUrl,
  scope: config.scope,
  state: randomstring.generate(32)
});

// Initial page redirecting to Github
router.get('/', (req, res) => {
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
router.get('/callback', (req, res) => {
  const code = req.query.code;
  var options = {
    code: code
  };

  if (oauth_provider === 'gitlab') {
    options.client_id = process.env.OAUTH_CLIENT_ID;
    options.client_secret = process.env.OAUTH_CLIENT_SECRET;
    options.grant_type = 'authorization_code';
    options.redirect_uri = process.env.REDIRECT_URL;
  }

  oauth2.authorizationCode.getToken(options, (error, result) => {
    let mess, content;

    if (error) {
      logger.error('Access Token Error', error.message);
      mess = 'error';
      content = JSON.stringify(error);
    } else {
      const token = oauth2.accessToken.create(result);
      mess = 'success';
      content = {
        token: token.token.access_token,
        provider: oauth_provider
      };
    }

    const script = `
    <script>
    (function() {
      function recieveMessage(e) {
        console.log("recieveMessage %o", e)
        // send message to main window with da router
        window.opener.postMessage(
          'authorization:${oauth_provider}:${mess}:${JSON.stringify(content)}',
          e.origin
        )
      }
      window.addEventListener("message", recieveMessage, false)
      // Start handshare with parent
      console.log("Sending message: %o", "${oauth_provider}")
      window.opener.postMessage("authorizing:${oauth_provider}", "*")
      })()
    </script>`;
    return res.send(script);
  });
});

router.get('/success', (req, res) => {
  res.send('');
});

module.exports = router;
