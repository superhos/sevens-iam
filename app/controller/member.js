'use strict';

const md5 = require('md5')

module.exports = app => {
  class MemberController extends app.Controller {

    async login () {
      await this.ctx.render('login.ejs', {
        data: {
          'system_info': app.config.systemInfo,
          err: this.ctx.query.error || '',
          redirect_url: this.ctx.query.redirect_url || ''
        }
      })
    }

    async loginOp () {
      const { username, password } = this.ctx.request.body
      const user = await this.ctx.service.member.findOne({ username });
      if (!user || username !== user.username || md5(password) !== user.password) {
        const url = `${this.ctx.request.host}/member/login?redirect_url=${encodeURIComponent(this.ctx.request.body.redirect_url)}&error=${this.ctx.__('LoginFail')}`
        const result = await this.ctx.curl(url)
        this.ctx.set(result.header);
        this.ctx.body = result.data.toString();
        return
      }
      delete user.password;
      this.ctx.session.user = user

      this.ctx.redirect(`${decodeURIComponent(this.ctx.request.query.redirect_url || this.ctx.request.body.redirect_url)}`)
    }

  }
  return MemberController;
};