'use strict';
const InvalidLoginError = require('../error/invalid-login-error');
const InvalidGrantError = require('oauth2-server').InvalidGrantError;
const moment = require('moment')

module.exports = () => {

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
        this.ctx.session = null
        throw new InvalidLoginError(`${this.ctx.__('NOCOOKIE')}`)
      }
      
      const { username, password } = this.ctx.session.user;
      const user = await this.ctx.model.User.findOne({ username: this.ctx.session.user.username });
      if (!user || username !== user.username || password !== user.password) {
        this.ctx.session = null
        throw new InvalidLoginError(`${this.ctx.__('LoginFail')}`)
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
      if (!code) {
        throw new InvalidGrantError('Invalid grant: authorization code has used');
      }
      const client = await this.ctx.model.OAuthClient.findOne({ _id: code.client });
      const user = await this.ctx.model.User.findOne({ _id: code.user });
      
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
      const token = await this.ctx.model.OAuthAccessToken.findOne({ accessToken: bearerToken });
      if (!token) {
        return;
      }

      const { user, client } = token;
      const userData = await this.ctx.model.User.findOne({ _id: user });
      const clientData = await this.ctx.model.OAuthClient.findOne({ _id: client });
      token.user = userData;
      token.client = clientData;
      return token;
    }

    // async getRefreshToken(refreshToken) {
    //   // imaginary DB queries
    //   const token = await this.ctx.model.OAuthAccessToken.findOne({ refreshToken })
    //   if (!token) {
    //     throw new InvalidGrantError('Invalid grant: refresh token invaid')
    //   }
    //   token.client = await this.ctx.model.OAuthClient.findOne({ _id: token.client })
    //   token.user = await this.ctx.model.User.findOne({ _id: token.user })
   
    //   return {
    //     refreshToken: token.refreshToken,
    //     refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    //     scope: token.scope,
    //     client: token.client, // with 'id' property
    //     user: token.user
    //   }
    // }

    async saveToken(token, client, user) {
      const _token = Object.assign({}, token, { user: user._id }, { client: client._id });

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
