/**
 * This is done because Ads code uses modil.js
 * which has its own implementation of define and require
 */
loader.noConflict({
	define: 'mdefine',
	require: 'mrequire'
});
