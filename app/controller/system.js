'use strict';

const Controller = require('egg').Controller;
const { version } = require('../../package.json');

class SystemController extends Controller {
  async version() {
    this.ctx.body = { version };
  }
}

module.exports = SystemController;
