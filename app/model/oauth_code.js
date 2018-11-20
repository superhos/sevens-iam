// 'use strict';
// /**
//  * Member model
//  * @param {app} app the framework app
//  * @return {Modal} the modal of mongoose
//  */
// module.exports = app => {
//   const mongoose = app.mongoose;
//   const Schema = mongoose.Schema;

//   const OauthAccessTokenSchema = new Schema({
//     userType: { type: String },
//     userId: { type: String, ref: 'member' },
//     clientId: { type: String },
//     revoked: { type: Boolean, default: false },
//     accessToken: String,
//     scope: String,
//     accessTokenExpiresAt: { type: Date },
//     refreshToken: String,
//     refreshTokenExpiresAt: { type: Date },
//   }, { collection: 'oauth_access_tokens' });

//   return mongoose.model('OauthAccessToken', OauthAccessTokenSchema);
// };
