'use strict';

// had enabled by egg
// exports.static = true;
exports.oauth2Server = {
  enable: true,
  package: 'egg-oauth2-server',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

// exports.mongo = {
//   enable: true,
//   package: 'egg-mongo-native',
// };
