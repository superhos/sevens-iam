'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  app.get('/', controller.system.version);
  // 用户
  app.get('/user/login', controller.user.login);
  app.post('/user/login', controller.user.loginOp);
  app.get('/user/register', controller.user.login);
  app.post('/user/register', controller.user.loginOp);

  // authorization_code mode
  // 授权
  app.get('/oauth2/authorize', controller.authorize.index);
  app.post('/oauth2/authorize', app.oAuth2Server.authorize({ allowEmptyState: true }));
  // 申请token
  app.all('/oauth2/access_token', app.oAuth2Server.token());
  // 验证
  app.get('/oauth2/authenticate', app.oAuth2Server.authenticate(), 'authorize.authenticate');
  router.resources('clients', '/oauth2/clients', app.oAuth2Server.authenticate(), controller.clients);
};
