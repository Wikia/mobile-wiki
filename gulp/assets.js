/**
 * Package definitions
 * key will become a file name
 * same key can be used in template to include a package
 * {{getComponent 'main'}}
 *
 */

module.exports = {
	main: [
		'jquery/dist/jquery.js',
		'handlebars/handlebars.runtime.js',
		'ember/ember.js',
		'i18next/i18next.js'
	]
};
