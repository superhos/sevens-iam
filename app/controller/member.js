'use strict';

const md5 = require('md5')

module.exports = app => {
  class MemberController extends app.Controller {

    async login () {
      await this.ctx.render('login.ejs', {
        data: {
          'system_info': app.config.systemInfo
        }
      })
    }

    async loginOp () {
      const { username, password } = this.ctx.request.body
      const user = await this.ctx.service.member.findOne({ username });
      if (!user || username !== user.username || md5(password) !== user.password) {
        this.ctx.redirect(`${this.ctx.request.originalUrl.replace(/&error=(.+)/g,'')}&error=${this.ctx.__('LoginFail')}`)
        return
      }
      delete user.password;
      this.ctx.session.user = user

      this.ctx.redirect(`${decodeURIComponent(this.ctx.request.query.redirect_url)}`)
    }

  }
  return MemberController;
};