'use strict';
/**
 * OAuthScopeSchema
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
const { toSnakeCase } = require('../utils/utils');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const OAuthScopeSchema = new Schema({
    scope: String,
    is_default: Boolean,
    lable: JSON,
    descript: JSON,
    title: String,
  }, { collection: toSnakeCase('OAuthScope') });

  return mongoose.model('OAuthScope', OAuthScopeSchema);
};
