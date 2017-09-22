const EmberApp = require('ember-cli/lib/broccoli/ember-app'),
	Funnel = require('broccoli-funnel'),
	stew = require('broccoli-stew');

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
					'modules/ember-types/property/*.js'
				);
			}

			return tree;
		}
	}).filter(Boolean);
};

module.exports = function (defaults) {
	const inlineScriptsPath = 'app/inline-scripts/';
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
			extensions: ['js', 'css', 'svg', 'png', 'jpg', 'gif', 'map'],
			exclude: ['player.ooyala.com'],
			replaceExtensions: ['html', 'css', 'js', 'hbs'],
			prepend: 'http://mobile-wiki.nocookie.net/'
		},
		inlineContent: {
			globals: `${inlineScriptsPath}globals.js`,
			'get-from-shoebox': `${inlineScriptsPath}get-from-shoebox.js`,
			'geo-cookie': `${inlineScriptsPath}geo-cookie.js`,
			'load-script': `${inlineScriptsPath}load-script.js`,
			'tracking-quantcast': `${inlineScriptsPath}tracking-quantcast.js`,
			'tracking-comscore': `${inlineScriptsPath}tracking-comscore.js`,
			'measure-first-render': `${inlineScriptsPath}measure-first-render.html`,
			'load-svg': `${inlineScriptsPath}load-svg.js`,
			'tracking-liftigniter': `${inlineScriptsPath}tracking-liftigniter.js`,
			'tracking-nielsen': `${inlineScriptsPath}tracking-nielsen.js`,
			'tracking-netzathleten': `${inlineScriptsPath}tracking-netzathleten.js`,
			'tracking-ua-init': `${inlineScriptsPath}tracking-ua-init.js`,
			'mercury-shared': `node_modules/mercury-shared/dist/mercury-shared.js`
		},
		outputPaths: {
			app: {
				css: {
					app: '/assets/app.css',
					'ooyala/index': '/assets/ooyala.css'
				},
				html: 'index.html',
			}
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
			]
		},
		eslint: {
			testGenerator: 'qunit',
			group: true,
			rulesDir: '.',
			extensions: ['js'],
		}
	});

	const designSystemAssets = new Funnel(`${app.bowerDirectory}/design-system/dist/svg/sprite.svg`, {
		destDir: 'assets/design-system.svg'
	});

	// Assets which are lazy loaded
	const designSystemI18n = new Funnel('node_modules/design-system-i18n/i18n', {
			destDir: 'locales'
		}),
		ooyalaAssets = new Funnel('node_modules/html5-skin/build', {
			destDir: 'assets/ooyala'
		});

	return app.toTree([
		designSystemI18n,
		ooyalaAssets,
		designSystemAssets
	]);
};
