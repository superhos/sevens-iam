'use strict';
/**
 * Member model
 * @param {app} app the framework app
 * @return {Modal} the modal of mongoose
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const MemberSchema = new Schema({
    applicationId: { type: String, ref: 'application'},
    title: { type: String },
    username: { type: String },
    password: { type: String },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date },
    lastLoginIp: { type: String },
    rememberToken: { type: String },
    enabled: { type: Boolean, default: true },
  });

  return mongoose.model('Member', MemberSchema);
};
