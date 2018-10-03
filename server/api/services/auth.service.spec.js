const simpleOauthModule = require('simple-oauth2');

const config = require('../util/config');

describe('AuthService', () => {
  beforeEach(() => {
    authService = require('./auth.service');
  });

  afterEach(() => {
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
      const createStub = sinon
        .stub(simpleOauthModule, 'create')
        .returns({});

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
      });

      createStub.restore();
    });
    it('should call getTokens with options argument', () => {
      const mockOptions = { some: 'options' };
      authService.oauth2.authorizationCode.getToken = sinon.stub();
      const getTokenStub = authService.oauth2.authorizationCode.getToken;
 
      authService._getToken(mockOptions);

      sinon.assert.calledOnce(getTokenStub);
      expect(getTokenStub.getCall(0).args[0]).to.equal(mockOptions);
    });
  });
});