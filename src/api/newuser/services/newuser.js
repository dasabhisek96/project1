'use strict';

/**
 * newuser service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::newuser.newuser');
