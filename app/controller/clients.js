module.exports = app => {
  /**
   * Application
   * 合作应用管理
   */

  class ClientController extends app.Controller {

    async index () {
      this.ctx.body = 'haha client index'
    }

    async create () {
      const res = await this.ctx.service.client.insert({
        ...this.ctx.request.body
      })

      this.ctx.body = res
    }
  }
  
  return ClientController;
};
