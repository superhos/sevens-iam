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

  const OAuthAccessTokenSchema = new Schema({
    accessToken: String,
    accessTokenExpiresAt: Date,
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    scope: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
  }, { collection: toSnakeCase('OAuthAccessToken') });

  return mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema);
};
