const simpleOauthModule = require('simple-oauth2');

const config = require('../util/config');

describe('AuthService', () => {
  let authService;
  let createStub;


  beforeEach(() => {
    createStub = sinon
      .stub(simpleOauthModule, 'create')
      .returns({}) ;
   
    authService = require('./auth.service');
  });

  afterEach(() => {
    createStub.restore();

    authService = undefined;
  });

  describe('Constructor', () => {
    it('should be created with three properties', () => {
      expect(authService);
      expect(authService.oauth_provider).to.be.a('string');
      expect(authService.simpleOauthModule).to.be.an('object');
      expect(authService.oauth2).to.be.an('object');
    });
  });

  describe('Class methods', () => {
    it('_getOauthClient should call create with args', () => {
      authService._getOauthClient();
      sinon.assert.calledWith(createStub, {
        client: {
          id: config.clientId,
          secret: config.clientSecret
        },
        auth: {
          tokenHost: config.gitHostname,
          tokenPath: config.tokenPath,
          authorizePath: config.authorizePath
        }
      })
    });
  });
});