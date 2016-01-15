/* global module */
/* eslint-env es5, node */
/* eslint prefer-template: 0, no-var: 0 */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
	var app = new EmberApp(defaults, {
		autoprefixer: {
			browsers: ['last 2 version', '> 1%'],
			cascade: false,
			map: false
		},
		inlineContent: {
			baseline: 'vendor/baseline.js',
			'wikia-logo': '../common/public/symbols/wikia-logo-blue.svg'
		},
		sassOptions: {
			includePaths: [
				'app/styles'
			]
		},
		svgstore: {
			files: [
				{
					sourceDirs: 'app/symbols/main',
					outputFile: '/assets/main.svg'
				},
				{
					sourceDirs: 'app/symbols/discussions',
					outputFile: '/assets/discussions.svg'
				},
				// This duplicates build-common-symbols task but we still want to do it
				// as there is no easy way to use external rev-manifest.json in here
				{
					sourceDirs: '../common/public/symbols',
					outputFile: '/assets/common.svg'
				}
			]
		},
		outputPaths: {
			app: {
				css: {
					app: 'assets/app.css',
					'app-dark-theme': 'assets/app-dark-theme.css'
				}
			}
		},
		fingerprint: {
			extensions: ['js', 'css', 'svg', 'png', 'jpg', 'gif', 'map'],
			prepend: 'http://mercury.nocookie.net/mercury-static/main/'
		},
		derequire: {
			patterns: [
				{
					from: 'define',
					to: 'mefine'
				},
				{
					from: 'require',
					to: 'mequire'
				}
			]
		},
		trees: {
			// By default vendor is not watched by Ember CLI and we want to rebuild when common scripts are modified
			vendor: 'vendor'
		},
		hinting: false
	});

	// Files below are concatenated to assets/vendor.js
	app.import(app.bowerDirectory + '/script.js/dist/script.js');
	app.import(app.bowerDirectory + '/fastclick/lib/fastclick.js');
	app.import(app.bowerDirectory + '/hammerjs/hammer.js');
	app.import(app.bowerDirectory + '/headroom.js/dist/headroom.js');
	app.import(app.bowerDirectory + '/jquery.cookie/jquery.cookie.js');
	app.import(app.bowerDirectory + '/ember-hammer/ember-hammer.js');
	app.import(app.bowerDirectory + '/i18next/i18next.js');
	app.import(app.bowerDirectory + '/vignette/dist/vignette.js');
	app.import(app.bowerDirectory + '/numeral/numeral.js');
	app.import(app.bowerDirectory + '/weppy/dist/weppy.js');
	app.import(app.bowerDirectory + '/visit-source/dist/visit-source.js');
	app.import(app.bowerDirectory + '/Autolinker.js/dist/Autolinker.min.js');
	app.import(app.bowerDirectory + '/ember-performance-sender/dist/ember-performance-sender.js');
	app.import('vendor/common.js');

	return app.toTree();
};
