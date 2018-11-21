'use strict';
/**
 * Member model
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const OauthCodeSchema = new Schema({
    authorization_code: { type: String },
    authorizationCode: { type: String },
    redirect_uri: { type: String },
    client_id: { type: String },
    scope: String,
    user_id: String,
    expires_at: { type: Date },
  }, { collection: 'oauth_code' });

  return mongoose.model('OauthCode', OauthCodeSchema);
};