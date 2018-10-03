const simpleOauthModule = require('simple-oauth2');
const randomstring = require('randomstring');

const logger = require('../util/logger');
const config = require('../util/config');

class AuthService {
  constructor() {
    this.oauth_provider = config.oauthProvider;
    this.simpleOauthModule = simpleOauthModule;
    this.oauth2 = this._getOauthClient();
  }

  _getOauthClient() {
    return this.simpleOauthModule.create({
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
  }

  _getToken(options) {
    return this.oauth2.authorizationCode.getToken(
      options,
      (error, result) => {
        let mess, content;

        if (error) {
          logger.error('Access Token Error', error.message);
          mess = 'error';
          content = JSON.stringify(error);
        } else {
          const token = this.oauth2.accessToken.create(result);
          mess = 'success';
          content = {
            token: token.token.access_token,
            provider: this.oauth_provider
          };
        }

        const successScript = `
        <script>
        (function() {
          function recieveMessage(e) {
            console.log("recieveMessage %o", e)
            // send message to main window with da router
            window.opener.postMessage(
              'authorization:${
                this.oauth_provider
              }:${mess}:${JSON.stringify(content)}',
              e.origin
            )
          }
          window.addEventListener("message", recieveMessage, false)
          // Start handshare with parent
          console.log("Sending message: %o", "${this.oauth_provider}")
          window.opener.postMessage("authorizing:${
            this.oauth_provider
          }", "*")
          })()
        </script>`;

        return successScript;
      }
    );
  }

  getAuthorizationUri() {
    return this.oauth2.authorizationCode.authorizeURL({
      redirect_uri: config.redirectUrl,
      scope: config.scope,
      state: randomstring.generate(32)
    });
  }

  authorize(code) {
    let options = { code };

    if (this.oauth_provider === 'gitlab') {
      options.client_id = process.env.OAUTH_CLIENT_ID;
      options.client_secret = process.env.OAUTH_CLIENT_SECRET;
      options.grant_type = 'authorization_code';
      options.redirect_uri = process.env.REDIRECT_URL;
    }

    return this._getToken(options);
  }
}

module.exports = new AuthService();
