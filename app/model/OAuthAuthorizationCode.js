'use strict';
/**
 * OAuthAuthorizationCode model
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
const { toSnakeCase } = require('../utils/utils');
const moment = require('moment')

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const OAuthAuthorizationCodeSchema = new Schema({
    code: String,
    expiresAt: { type: Date, default: moment().add(15,'minutes').toDate()},
    redirectUri: String,
    scope: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
  }, { collection: toSnakeCase('OAuthAuthorizationCode') });

  return mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCodeSchema);
};
