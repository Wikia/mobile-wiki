/* global loader */
/* eslint no-undefined:0 */

/**
 * This is done because Ads code uses modil.js
 * which has its own implementation of define and require
 */
loader.noConflict({
	define: 'mdefine',
	require: 'mrequire'
});

/**
 * Clean it up for modil.js
 */
window.require = undefined;
window.define = undefined;
