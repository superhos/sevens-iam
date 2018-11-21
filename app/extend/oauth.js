'use strict'
const md5 = require('md5')

module.exports = app => {

  class oauth {
    constructor(ctx) {
      this.ctx = ctx
    }

    async getClient(clientId, clientSecret) {
      const client = await this.ctx.service.client.findOne({ clientId })
      if (clientId !== client.clientId) {
        return
      }
      return client
    }
    
    async getUser(username, password) {
      const user = await this.ctx.service.member.findOne({ username })
      if (!user || username !== user.username || md5(password) !== user.password) {
        return
      }
      delete user.password
      return user
    }

    async getUserFromClient(client) {
      // imaginary DB query
      return await this.ctx.service.member.findOne({ client_id: client })
    }

    async saveAuthorizationCode(code, client, user) {
      // app.logger.debug('#saveAuthorizationCode')
       // imaginary DB queries
       let authCode = {
        authorization_code: code.authorizationCode,
        expires_at: code.expiresAt,
        redirect_uri: code.redirectUri,
        scope: code.scope,
        client_id: client.id,
        user_id: user.id,
      };
      let result = await this.ctx.model.OauthCode.create(authCode)
      // result.aga = code.authorizationCode
      result = result.toJSON()
      return result;
    }

    async getAuthorizationCode(authorizationCode) {
      // imaginary DB queries
      const code = await this.ctx.model.OauthCode.findOne({authorization_code: authorizationCode})
      
      return {
        code: code.authorization_code,
        expiresAt: code.expires_at,
        redirectUri: code.redirect_uri,
        scope: code.scope,
        // client: client, // with 'id' property
        // user: user
      };
    }

    async getAccessToken(bearerToken) {
      app.logger.debug('#get_token')
      const token = await this.ctx.service.oauthAccessToken.findOne({ accessToken: bearerToken })
      if (!token) {
        return
      }
      const { userId, clientId } = token
      const user = await this.ctx.service.member.findOne({ _id: userId })
      const client = await this.ctx.service.client.findOne({ clientId })
      token.user = user
      token.client = client
      return token
    }

    async saveToken(token, client, user) {
      delete token.authorizationCode
      const _token = Object.assign({}, token, { userId: user.userId || user._id }, { clientId: client.clientId })

      await this.ctx.service.oauthAccessToken.create(_token)
      _token.client = client
      _token.user = user
      return _token
    }

    async revokeToken(token) {
      await this.ctx.service.oauthAccessToken.destroy({
        refreshToken: token.refreshToken,
      })
    }

    // async getAuthorizationCode(authorizationCode) {
    //   const code = await this.ctx.service.oauthCode.findOne({
    //     authorizationCode,
    //   })
    //   if (!code) {
    //     return
    //   }
    //   const { userId, clientId } = code
    //   const user = await this.ctx.service.member.findOne({ id: userId })
    //   const client = await this.ctx.service.client.findOne({ clientId })

    //   code.code = code.authorizationCode
    //   code.user = user
    //   code.client = client
    //   return code
    // }

    // * saveAuthorizationCode(code, client, user) {
    //   app.logger.debug('#code_save')
    //   const _code = Object.assign({}, code, { userId: user.userId }, { clientId: client.clientId })
    //   yield this.ctx.service.oauthCode.create(_code)
    //   _code.user = user
    //   _code.client = client
    //   return _code
    // }

    // * revokeAuthorizationCode(code) {
    //   app.logger.debug('#code_revoke')
    //   yield this.ctx.service.oauthCode.destroy({
    //     authorizationCode: code.code,
    //   })
    //   return true
    // }
  }

  return oauth
}
