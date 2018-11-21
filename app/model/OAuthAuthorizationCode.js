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

  const OAuthAuthorizationCodeSchema = new Schema({
    code: String,
    expiresAt: Date,
    redirectUri: String,
    scope: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
  }, { collection: toSnakeCase('OAuthAuthorizationCode') });

  return mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCodeSchema);
};
