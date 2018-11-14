'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.get('/', controller.home.index);
  app.get('/', controller.home.index);
  // 申请token
  app.all('/api/token', app.oAuth2Server.token());
  // app.get('/user/authenticate', app.oAuth2Server.authenticate(), 'users.authenticate');
  router.resources('clients', '/api/clients', app.oAuth2Server.authenticate(), controller.clients)
};
