'use strict';
/**
 * Client model
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ClientSchema = new Schema({
    clientId: { type: String },
    title: { type: String },
    clientSecret: { type: String },
    secret: { type: String },
    redirectUris: { type: Array },
    grants: { type: Array },
    actions: { type: Array },
    applicationId: { type: String, ref: 'application' },
    refreshTokenLifetime: { type: Number },
    accessTokenLifetime: { type: Number },
  });

  return mongoose.model('Client', ClientSchema);
};
