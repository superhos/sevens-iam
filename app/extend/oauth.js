'use strict';

const path = require('path');

module.exports = app => {

  class oauth {
    constructor(ctx) {
      this.ctx = ctx;
    }

    async getClient(clientId, clientSecret) {
      const client = JSON.parse(JSON.stringify(await this.ctx.service.client.findOne({clientId})))
      console.log(JSON.stringify(client))
      console.log(Object.keys(client))
      console.log(clientId !== client.clientId , clientSecret !== client.clientSecret)
      if (clientId !== client.clientId || clientSecret !== client.clientSecret) {
        return;
      }
      return client;
    }

    async getUser(username, password) {
      const user = nconf.get('user');
      if (username !== user.username || password !== user.password) {
        return;
      }
      return { userId: user.id };
    }

    // async getUserFromClient(clientId, clientSecret) {
    //   const client = nconf.get('client');
    //   return { userId: clientSecret || client.clientSecret };
    // }

    // async getAccessToken(bearerToken) {
    async getAccessToken() {
      const token = nconf.get('token');
      token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt);
      token.refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt);
      const user = nconf.get('user');
      const client = nconf.get('client');
      token.user = user;
      token.client = client;
      return token;
    }

    async saveToken(token, client, user) {
      const _token = Object.assign({}, token, { user }, { client });
      nconf.set('token', _token);
      nconf.save();
      return _token;
    }
  }

  return oauth;
};
