/* globals blanket, module */

const options = {
	modulePrefix: 'main',
	filter: '//.*main/.*/',
	antifilter: '//.*(tests|config|template|initializers|transitions|flows|resolver|app).*/',
	loaderExclusions: [
		/**
		 * This are particular files that should not be counted when computing
		 * overall test coverage of our code - they are coming from external addons
		 * we are using and by default are not excluded from blanket loader.
		 * This is a known bug in ember-cli-blanket: https://github.com/sglanzer/ember-cli-blanket/issues/17
		 * and hopefully will be fixed soon.
		 */
		'main/components/lf-outlet',
		'main/components/lf-overlay',
		'main/components/liquid-if',
		'main/components/liquid-modal',
		'main/components/liquid-outlet',
		'main/components/liquid-spacer',
		'main/components/liquid-unless',
		'main/components/liquid-with',
		'main/components/sortable-group',
		'main/components/liquid-bind',
		'main/components/liquid-measured',
		'main/components/liquid-container',
		'main/components/liquid-versions',
		'main/components/liquid-child',
		'main/components/app-version',
		'main/components/head-tag',
		'main/components/head-tags',
		'main/components/lm-container',
		'main/components/sortable-item',
		'main/controllers/array',
		'main/controllers/object',
		'main/mixins/link-action',
		'main/services/ajax',
		'main/services/head-tags',
		'main/services/liquid-fire-modals'
	],
	enableCoverage: true,
	cliOptions: {
		reporters: ['json'],
		autostart: true
	}
};

if (typeof exports === 'undefined') {
	blanket.options(options);
} else {
	module.exports = options;
}
