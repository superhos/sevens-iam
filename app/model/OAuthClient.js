'use strict';
/**
 * Client model
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
const { toSnakeCase } = require('../utils/utils');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  // const ClientSchema = new Schema({
  //   clientId: { type: String },
  //   title: { type: String },
  //   clientSecret: { type: String },
  //   secret: { type: String },
  //   redirectUris: { type: Array },
  //   grants: { type: Array },
  //   allow_scopes: { type: Array },
  //   applicationId: { type: String, ref: 'application' },
  //   refreshTokenLifetime: { type: Number },
  //   accessTokenLifetime: { type: Number },
  // });

  const OAuthClientSchema = new Schema({
    name: String,
    clientId: String,
    clientSecret: String,
    redirectUris: {
      type: [ String ],
    },
    grants: {
      type: [ String ],
      default: [ 'authorization_code', 'password', 'refresh_token', 'client_credentials' ],
    },
    scope: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  }, { collection: toSnakeCase('OAuthClient') });

  return mongoose.model('OAuthClient', OAuthClientSchema);
};
