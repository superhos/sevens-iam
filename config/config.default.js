'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.systemInfo = {}
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1542168498168_6998';

  // add your config here
  config.middleware = [];

  config.oAuth2Server = {
    debug: config.env === 'local',
    grants: [ 'password', 'client_credentials' ],
  };

  // recommended
  config.mongoose = {
    client: {
      url: 'mongodb://sevens:112358@127.0.0.1:27017/sevens-iam',
      options: {
      },
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList:['.sevens.com'],  // 安全白名单，以 . 开头
  };

  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
  };

  return config;
};
