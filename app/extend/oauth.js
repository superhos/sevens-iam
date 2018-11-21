'use strict';
const InvalidLoginError = require('../error/invalid-login-error');

module.exports = app => {

  class oauth {
    constructor(ctx) {
      this.ctx = ctx;
    }

    async getClient(clientId, clientSecret) {
      const params = { clientId };
      if (clientSecret) {
        params.clientSecret = clientSecret;
      }

      await this.ctx.model.OAuthClient.create(params);
      const client = await this.ctx.model.OAuthClient.findOne(params);
      if (clientId !== client.clientId) {
        return;
      }
      return client;
    }

    async getUser() {
      if (!this.ctx.session || !this.ctx.session.user) {
        throw new InvalidLoginError(`${this.ctx.__('NOCOOKIE')}`);
      }

      const { username, password } = this.ctx.session.user;
      const user = await this.ctx.model.User.findOne({ username: this.ctx.session.user.username });
      if (!user || username !== user.username || password !== user.password) {
        throw new InvalidLoginError(`${this.ctx.__('LoginFail')}`);
      }
      delete user.password;
      return user;
    }

    async saveAuthorizationCode(code, client, user) {
      const authCode = {
        code: code.authorizationCode,
        user: { _id: user._id },
        client: { _id: client._id },
        ...code,
      };
      const result = await this.ctx.model.OAuthAuthorizationCode.create(authCode);
      const authorizationCode = result.toJSON();
      return {
        authorizationCode: authorizationCode.code,
        expiresAt: authorizationCode.expiresAt,
        redirectUri: authorizationCode.redirectUri,
        scope: authorizationCode.scope,
        client: { id: authorizationCode.client._id },
        user: { id: authorizationCode.user._id },
      };
    }

    async getAuthorizationCode(authorizationCode) {
      const code = await this.ctx.model.OAuthAuthorizationCode.findOne({ code: authorizationCode });
      const client = await this.ctx.model.OAuthClient.findOne({ _id: code.client._id });
      const user = await this.ctx.model.User.findOne({ _id: code.user._id });

      return {
        code: code.code,
        expiresAt: code.expiresAt,
        redirectUri: code.redirectUri,
        scope: code.scope,
        client,
        user,
      };
    }

    async revokeAuthorizationCode(code) {
      const result = await this.ctx.model.OAuthAuthorizationCode.deleteOne({ authorization_code: code.authorizationCode });
      return !!result.ok;
    }

    async getAccessToken(bearerToken) {
      app.logger.debug('#get_token');
      const token = await this.ctx.model.OAuthAccessToken.findOne({ accessToken: bearerToken });
      if (!token) {
        return;
      }
      const { userId, clientId } = token;
      const user = await this.ctx.model.User.findOne({ _id: userId });
      const client = await this.ctx.model.OAuthClient.findOne({ clientId });
      token.user = user;
      token.client = client;
      return token;
    }

    async saveToken(token, client, user) {
      const _token = Object.assign({}, token, { userId: user.userId || user._id }, { clientId: client.clientId });

      await this.ctx.model.OAuthAccessToken.create(_token);
      _token.client = client;
      _token.user = user;

      return _token;
    }

    async revokeToken(token) {
      await this.ctx.model.OAuthAccessToken.deleteOne({
        refreshToken: token.refreshToken,
      });
    }
  }

  return oauth;
};
