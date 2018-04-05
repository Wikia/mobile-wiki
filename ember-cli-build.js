const EmberApp = require('ember-cli/lib/broccoli/ember-app'),
	Funnel = require('broccoli-funnel'),
	stew = require('broccoli-stew'),
	SVGStore = require('broccoli-svgstore'),
	lazyloadedSVGs = require('./config/svg').lazyloadedSVGs;

/**
 * We override Ember's private method to remove files from the final build
 * which are added by addons but not used by us
 *
 * HEADS UP!
 * If you update ember-cli and something breaks,
 * the first thing you should try is to comment this out
 */
EmberApp.prototype.addonTreesFor = function (type) {
	return this.project.addons.map((addon) => {
		if (addon.treeFor) {
			let tree = addon.treeFor(type);

			if (tree) {
				// uncomment to see the files available to be filtered out
				// tree = stew.log(tree, {output: 'tree'});
				tree = stew.rm(
					tree,
					'modules/ember-types/asserts/**/*.js',
					'modules/ember-types/constants/*.js',
					'modules/ember-types/property/*.js',
					'ember-responds-to/mixins/responds-to-enter-keydown.js',
					'ember-responds-to/mixins/responds-to-esc-keydown.js',
					'ember-responds-to/mixins/responds-to-print.js'
				);
			}

			return tree;
		}
	}).filter(Boolean);
};

module.exports = function (defaults) {
	const inlineScriptsPath = 'vendor/inline-scripts/';
	const app = new EmberApp(defaults, {
		autoprefixer: {
			cascade: false,
			map: false
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
		fingerprint: {
			exclude: ['app.css'],
			extensions: ['js', 'css', 'svg', 'png', 'jpg', 'gif', 'map'],
			replaceExtensions: ['html', 'css', 'js', 'hbs']
		},
		inlineContent: {
			'fastboot-inline-scripts-body-bottom': `node_modules/mercury-shared/dist/body-bottom.js`,
			'fastboot-inline-scripts': `node_modules/mercury-shared/dist/head.js`,
			'fastboot-inline-scripts-tracking': `node_modules/mercury-shared/dist/head-tracking.js`,
			'fastboot-inline-scripts-load-svg': `node_modules/mercury-shared/dist/load-svg.js`,
			'tracking-internal': `${inlineScriptsPath}tracking-internal.js`,
			'tracking-liftigniter': `${inlineScriptsPath}tracking-liftigniter.js`,
			'tracking-netzathleten': `${inlineScriptsPath}tracking-netzathleten.js`,
			'tracking-ua': `${inlineScriptsPath}tracking-ua.js`,
			'async-scripts': `${inlineScriptsPath}async-scripts.js`,
			lazysizes: `${inlineScriptsPath}lazysizes.js`,
			'load-ads': `${inlineScriptsPath}load-ads.js`
		},
		outputPaths: {
			app: {
				css: {
					app: '/assets/app.css',
					lazy: '/assets/lazy.css',
				},
				html: 'index.html',
			}
		},
		sassOptions: {
			includePaths: [
				'node_modules/design-system/dist/scss',
				'node_modules/@wikia/ad-products/dist'
			],
			onlyIncluded: true
		},
		stylelint: {
			testFailingFiles: true
		},
		eslint: {
			testGenerator: 'qunit',
			group: true,
			rulesDir: '.',
			extensions: ['js'],
		},
		vendorFiles: {
			// This should be removed when ember-cli-shims is sunset
			'app-shims.js': null,
			'jquery.js': null
		}
	});

	const designSystemIcons = new Funnel('node_modules/design-system/style-guide/assets', {
		include: lazyloadedSVGs.map((icon) => `${icon.name}.svg`)
	});
	const svgStore = new SVGStore(designSystemIcons, {
		outputFile: 'assets/design-system.svg',
		svgstoreOpts: {}
	});

	// Assets which are lazy loaded
	const designSystemI18n = new Funnel('node_modules/design-system-i18n/i18n', {
			destDir: 'locales'
		}),
		jwPlayerAssets = new Funnel('node_modules/jwplayer-fandom/dist', {
			destDir: 'assets/jwplayer'
		});

	// Import files from node_modules, they will run both in FastBoot and browser
	app.import('node_modules/vignette/dist/vignette.js');
	app.import('vendor/polyfills.js', {prepend: true});

	// These will run only in browser
	app.import('node_modules/visit-source/dist/visit-source.js', {
		using: [{transformation: 'fastbootShim'}]
	});
	app.import('node_modules/scriptjs/dist/script.min.js', {
		using: [{transformation: 'fastbootShim'}]
	});
	app.import('node_modules/hammerjs/hammer.min.js', {
		using: [{transformation: 'fastbootShim'}]
	});
	app.import('node_modules/ember-hammer/ember-hammer.js', {
		using: [{transformation: 'fastbootShim'}]
	});
	app.import('node_modules/js-cookie/src/js.cookie.js', {
		using: [{transformation: 'fastbootShim'}]
	});
	app.import('node_modules/lazysizes/lazysizes.js', {
		using: [{transformation: 'fastbootShim'}]
	});

	return app.toTree([
		designSystemI18n,
		svgStore,
		jwPlayerAssets
	]);
};
