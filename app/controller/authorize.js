'use strict';
const AuthServer = require('oauth2-server');

module.exports = app => {
  class AuthorizeController extends app.Controller {

    async index() {

      console.log(AuthServer)
      if (!this.vaildParamsForAuthorize(this.ctx.query)){
        this.ctx.body = {"error":"unsupported_grant_type","message":"The authorization grant type is not supported by the authorization server.","hint":"Check that all required parameters have been provided"}
        return
      }

      const client = await this.ctx.service.client.findOne({clientId : this.ctx.query.client_id})

      if (!(client.redirectUris.find(e => e === this.ctx.query.redirect_uri))){
        this.ctx.body = {"error":"invalid_client","message":"Client authentication failed"}
        return
      }

      await this.ctx.render('authorize.ejs', {
        data: {
          'system_name': app.config.systemInfo.name || app.config.name
        }
      })
    }

    async create() {
      this.ctx.redirect('/oauth/authorize')
      // await this.ctx.render('authorize.ejs', {
      //   data: {
      //     'a': 'b'
      //   }
      // })
    }

    async update() {
      this.ctx.redirect('/oauth/authorize')
      // await this.ctx.render('authorize.ejs', {
      //   data: {
      //     'a': 'b'
      //   }
      // })
    }

    async destroy() {
      this.ctx.redirect('/oauth/authorize')
    }

    async authenticate() {
      this.ctx.body = { result: 'ok' };
    }

    vaildParamsForAuthorize (data) {
      const normal = {
        client_id: {
          nullable: false
        },
        redirect_uri: {
          nullable: false
        },
        response_type: {
          nullable: false
        },
        scope: {
          nullable: true
        },
        state: {
          nullable: true
        },
      }
      for (const key in normal) {
        if (!data[key] && !normal[key].nullable){
          return false
        }

        if (data[key] && !normal[key].nullable && data[key].length === 0){
          return false
        }
      }

      return true
    }

  }
  return AuthorizeController;
};
