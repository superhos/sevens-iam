'use strict';
/**
 * ActionSchema model
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ActionSchema = new Schema({
    title: { type: String },
    label: { type: Object },
    code: { type: String }
  });

  return mongoose.model('Action', ActionSchema);
};
