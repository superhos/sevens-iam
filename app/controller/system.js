'use strict';

const Controller = require('egg').Controller;
const { version } = require('../../package.json');

class SystemController extends Controller {
  async index() {
    const code = this.ctx.request.queries.code;

    // apply access_token
    // await this.ctx.curl()
    // console.log(this.ctx.model.User)
    this.ctx.body = `hi, ${code}`;
  }

  async version() {
    this.ctx.body = { version };
  }
}

module.exports = SystemController;
