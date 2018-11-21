'use strict';
/**
 * Member model
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
const { toSnakeCase } = require('../utils/utils');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  // const OauthAccessTokenSchema = new Schema({
  //   userType: { type: String },
  //   userId: { type: String, ref: 'member' },
  //   clientId: { type: String },
  //   revoked: { type: Boolean, default: false },
  //   accessToken: String,
  //   scope: String,
  //   accessTokenExpiresAt: { type: Date },
  //   refreshToken: String,
  //   refreshTokenExpiresAt: { type: Date },
  // }, { collection: 'oauth_access_tokens' });

  const OAuthAccessTokenSchema = new Schema({
    accessToken: String,
    accessTokenExpiresAt: Date,
    scope: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
  }, { collection: toSnakeCase('OAuthAccessToken') });

  return mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema);
};
