'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.systemInfo = {}
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1542168498168_6998';

  // add your config here
  config.middleware = [];

  // oAuth Setting
  config.oAuth2Server = {
    debug: config.env === 'local',
    grants: [ 'password', 'client_credentials' ],
  };

  // DB Setting
  config.mongoose = {
    client: {
      // url: 'mongodb://sevens:112358@127.0.0.1:27017/sevens-iam',
      url: 'mongodb://sevens:112358@47.90.14.129:27017/sevens-iam',
      options: {
      },
    },
  };

  // Security Setting
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList:['.sevens.com'],  // 安全白名单，以 . 开头
  };

  // View Setting
  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
  };

  // Error SETTING
  config.onerror = {
    all(err, ctx) {
      // all exception return JSON
      ctx.body = JSON.stringify(err);
      ctx.status = err.status || err.code
    }
  }

  // Language
  config.i18n = {
    defaultLocale: 'zh-CN',
    queryField: 'locale',
    cookieField: 'locale',
    // Cookie 默认一年后过期， 如果设置为 Number，则单位为 ms
    cookieMaxAge: 5000,
  }

  return config;
};
