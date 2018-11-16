'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  // router.get('/', controller.home.index);
  app.get('/', controller.home.index)
  // 申请token
  app.all('/oauth2/token', app.oAuth2Server.token())
  // 授权
  app.resources('/oauth2/authorize', controller.authorize)

  // 用户
  app.get('/member/login', controller.member.login)
  app.post('/member/login', controller.member.loginOp)

  // 验证
  app.get('/oauth2/authenticate', app.oAuth2Server.authenticate(), 'authorize.authenticate')
  router.resources('clients', '/oauth2/clients', app.oAuth2Server.authenticate(), controller.clients)
};
