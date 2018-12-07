'use strict';
const InvalidRequestError = require('oauth2-server/').InvalidRequestError;
const InvalidClientError = require('oauth2-server/').InvalidClientError;
const _ = require('lodash');

module.exports = app => {
  class AuthorizeController extends app.Controller {

    async index() {
      this.vaildParamsForAuthorize(this.ctx.query);

      const res = await this.ctx.model.OAuthClient.findOne({ clientId: this.ctx.query.client_id });

      if (!res) {
        throw new InvalidClientError('Invalid client: client is invalid');
      }

      const client = res.toJSON();

      const redirectUri = this.ctx.query.redirect_uri;
      if (redirectUri && !_.includes(client.redirectUris, redirectUri)) {
        throw new InvalidClientError('Invalid client: `redirect_uri` does not match client value');
      }

      // Check user session
      if ((!(this.ctx.session && this.ctx.session.user && this.ctx.session.user._id)) || this.ctx.query.forcelogin) {
        // Redirect to login
        const url = `${this.ctx.request.host}/user/login?redirect_url=${encodeURIComponent(this.ctx.request.originalUrl)}`;
        const result = await this.ctx.curl(url);
        this.ctx.set(result.header);
        this.ctx.body = result.data.toString();
        return;
      }

      // Get Scope
      const allow_scopes = client.allow_scopes;
      const scope = this.ctx.query.scope ? this.ctx.query.scope.split(',') : [];
      let scopesData = [];
      if (scope && scope.length > 0 && allow_scopes && allow_scopes.length > 0) {
        const applyScope = scope.find(e => e === 'all') ? allow_scopes : scope.filter(e => allow_scopes.find(ele => ele === e));
        const or = applyScope.map(e => { return { scope: e }; });
        scopesData = await this.ctx.model.OAuthScope.find({ $or: or });
      }

      await this.ctx.render('authorize.ejs', {
        data: {
          system_info: app.config.systemInfo,
          prms_list: scopesData,
          url_data: this.ctx.request.query,
        },
      });
    }

    async destroy() {
      this.ctx.redirect('/oauth/authorize');
    }

    async authenticate() {
      this.ctx.body = { result: 'ok' };
    }

    vaildParamsForAuthorize(data) {
      const normal = {
        client_id: {
          nullable: false,
        },
        redirect_uri: {
          nullable: false,
        },
        response_type: {
          nullable: false,
        },
        scope: {
          nullable: true,
        },
        state: {
          nullable: true,
        },
        // client_secret: {
        //   nullable: false,
        // },
        forcelogin: {
          nullable: true,
        },
        // token: {
        //   nullable: false
        // }
      };

      for (const key in normal) {
        if (!data[key] && !normal[key].nullable) {
          throw new InvalidRequestError(`Missing parameter: \`${key}\``);
        }

        if (data[key] && !normal[key].nullable && data[key].length === 0) {
          throw new InvalidRequestError('Invalid parameter: no content of \`${key}\`');
        }
      }

      return true;
    }

  }
  return AuthorizeController;
};
