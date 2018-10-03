module.exports = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'production',
  clientId: process.env.OAUTH_CLIENT_ID || '',
  clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
  redirectUrl: process.env.REDIRECT_URL || '',
  gitHostname: process.env.GIT_HOSTNAME || '',
};
