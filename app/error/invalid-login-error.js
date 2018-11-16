'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var OAuthError = require('oauth2-server/').OAuthError;
var util = require('util');

/**
 * Constructor.
 *
 * "The access token provided is expired, revoked, malformed, or invalid for other reasons."
 *
 * @see https://tools.ietf.org/html/rfc6750#section-3.1
 */

function InvalidLoginError(message, properties) {
  properties = _.assign({
    code: 422,
    name: 'invalid_login'
  }, properties);

  console.log(properties)

  OAuthError.call(this, message, properties);
}

/**
 * Inherit prototype.
 */

util.inherits(InvalidLoginError, OAuthError);

/**
 * Export constructor.
 */

module.exports = InvalidLoginError;
