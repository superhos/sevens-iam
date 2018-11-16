'use strict';
const InvalidRequestError = require('oauth2-server/').InvalidRequestError
const InvalidClientError = require('oauth2-server/').InvalidClientError
const _ = require('lodash')

module.exports = app => {
  class AuthorizeController extends app.Controller {

    async index() {
      this.vaildParamsForAuthorize(this.ctx.query)

      const client = await this.ctx.service.client.findOne({clientId : this.ctx.query.client_id})

      if (!client) {
        throw new InvalidClientError('Invalid client: client is invalid')
      }

      const redirectUri = this.ctx.query.redirect_uri;
      if (redirectUri && !_.includes(client.redirectUris, redirectUri)) {
        throw new InvalidClientError('Invalid client: `redirect_uri` does not match client value')
      }

      // Check user session
      if (!(this.ctx.session && this.ctx.session.user && this.ctx.session.user._id)) {
        // Redirect to login
        this.ctx.redirect(`/member/login?redirect_url=${encodeURIComponent(this.ctx.request.originalUrl)}`)
        return
      }

      // Get action
      const actions = client.actions
      let actionsData = []
      if (actions && actions.length > 0) {
        // const query = t
        let or = actions.map(e => {return { "code" : e }})
        // query.or(or)
        actionsData = await this.ctx.model.Action.find({ $or: or})
      }

      await this.ctx.render('authorize.ejs', {
        data: {
          'system_info': app.config.systemInfo,
          'prms_list'  : actionsData
        }
      })
    }

    async create() {
      // 登录
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
        token: {
          nullable: false
        }
      }

      for (const key in normal) {
        if (!data[key] && !normal[key].nullable){
          throw new InvalidRequestError(`Missing parameter: \`${key}\``)
        }

        if (data[key] && !normal[key].nullable && data[key].length === 0){
          throw new InvalidRequestError('Invalid parameter: `client_id`')
        }
      }

      return true
    }

  }
  return AuthorizeController;
};