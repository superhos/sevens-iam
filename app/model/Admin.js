'use strict';
/**
 * User app
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
const { toSnakeCase } = require('../utils/utils');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminSchema = new Schema({
    username: { type: String },
    password: { type: String },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
  }, { collection: toSnakeCase('Admin') });

  return mongoose.model('Admin', AdminSchema);
};
