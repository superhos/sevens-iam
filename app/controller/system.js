'use strict';

const Controller = require('egg').Controller;
const { version } = require('../../package.json');

class SystemController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }

  async check() {
    this.ctx.body = 'auth check';
  }

  async version() {
    this.ctx.body = { version }
  }
}

module.exports = SystemController;
