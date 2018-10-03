const simpleOauthModule = require('simple-oauth2');
const randomstring = require('randomstring');

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
    it('should call getAuthorizationUri with arguments', () => {
      const randomstringStub = sinon.stub(randomstring, 'generate').returns('1');
      authService.oauth2.authorizationCode.authorizeURL = sinon.stub();
      const authorizeURLStub = authService.oauth2.authorizationCode.authorizeURL;
 
      authService.getAuthorizationUri();

      sinon.assert.calledOnce(randomstringStub);
      sinon.assert.calledOnce(authorizeURLStub);
      sinon.assert.calledWith(authorizeURLStub, {
        redirect_uri: config.redirectUrl,
        scope: config.scope,
        state: '1'
      });
    });
    it('should call _getTokens with options', () => {
      const _getTokenStub = sinon.stub(authService, '_getToken');
      const mockCode = 'super secret';
      
      authService.authorize(mockCode);

      sinon.assert.calledWith(_getTokenStub, { code: mockCode });

      _getTokenStub.restore();
    });
  });
});