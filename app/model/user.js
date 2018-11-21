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

  const UserSchema = new Schema({
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
    title: { type: String },
    username: { type: String },
    password: { type: String },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date },
    lastLoginIp: { type: String },
    rememberToken: { type: String },
    scope: String,
    enabled: { type: Boolean, default: true },
  }, { collection: toSnakeCase('User') });

  return mongoose.model('User', UserSchema);
};
