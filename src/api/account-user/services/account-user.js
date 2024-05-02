'use strict';

/**
 * account-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::account-user.account-user');
