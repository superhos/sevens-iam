'use strict';

module.exports = app => {
  class UserController extends app.Controller {

    * index() {
      this.ctx.body = 'index';
    }

    * authenticate() {
      this.ctx.body = { result: 'ok' };
    }

    * read() {
      this.ctx.body = { result: 'read' };
    }

  }
  return UserController;
};
