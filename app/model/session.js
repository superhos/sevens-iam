'use strict';
/**
 * Session model
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SessionSchema = new Schema({
    userId: { type: String },
    userInfo: { type: String },
    expires: Date
  });

  return mongoose.model('Session', SessionSchema);
};
