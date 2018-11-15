'use strict';
/**
 * Application model
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ApplicationSchema = new Schema({
    title: { type: String },
  });

  return mongoose.model('Application', ApplicationSchema);
};
