'use strict';
/**
 * OAuthRefreshTokenSchema
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
const { toSnakeCase } = require('../utils/utils');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const OAuthRefreshTokenSchema = new Schema({
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    scope: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
  }, { collection: toSnakeCase('OAuthRefreshToken') });

  return mongoose.model('OAuthRefreshToken', OAuthRefreshTokenSchema);
};
