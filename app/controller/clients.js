'use strict';

module.exports = app => {
  /**
   * Application
   * 合作应用管理
   */

  class ClientController extends app.Controller {

    async index() {
      this.ctx.body = {
        msg: 'hello world',
      };
    }

    async create() {
      const res = await this.ctx.model.OAuthClient.insert({
        ...this.ctx.request.body,
      });

      this.ctx.body = res;
    }
  }

  return ClientController;
};
