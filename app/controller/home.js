'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }

  async check() {
    this.ctx.body = 'auth check';
  }
}

module.exports = HomeController;
