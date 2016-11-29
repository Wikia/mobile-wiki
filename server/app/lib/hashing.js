/**
 * Hashing function and help
 */

import settings from '../../config/settings';
import Crypto from 'crypto';

/**
 * Get md5 of string
 *
 * @param {string} string
 * @returns {string}
 */
export function md5(string) {
	return Crypto.createHash('md5').update(string).digest('hex');
}

/**
 * Get gaUserIdHash for user
 *
 * @param {integer} userId
 * @returns {string}
 */
export function gaUserIdHash(userId) {
	return userId > 0 ? md5(userId.toString() + settings.gaUserSalt) : '';
}
