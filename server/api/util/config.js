module.exports = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'production',
  clientId: process.env.OAUTH_CLIENT_ID || '',
  clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
  redirectUrl: process.env.REDIRECT_URL || '',
  gitHostname: process.env.GIT_HOSTNAME || 'https://github.com',
  tokenPath: process.env.OAUTH_TOKEN_PATH || '/login/oauth/access_token',
  authorizePath: process.env.OAUTH_AUTHORIZE_PATH || '/login/oauth/authorize',
  scope: process.env.SCOPES || 'repo,user',
  oauthProvider: process.env.OAUTH_PROVIDER || 'github',
  loginAuthTarget: process.env.AUTH_TARGET || '_self'
};
