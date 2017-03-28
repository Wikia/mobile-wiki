/* global module */
/* eslint-env es5, node */
/* eslint prefer-template: 0, prefer-arrow-callback: 0, no-var: 0, one-var: 0, vars-on-top: 0 */

var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
	esTranspiler = require('broccoli-babel-transpiler'),
	concat = require('broccoli-concat'),
	Funnel = require('broccoli-funnel'),
	BroccoliMergeTrees = require('broccoli-merge-trees'),
	stew = require('broccoli-stew'),
	uglify = require('broccoli-uglify-sourcemap');

/**
 * We override Ember's private method to remove files from the final build
 * which are added by addons but not used by us
 *
 * HEADS UP!
 * If you update ember-cli and something breaks,
 * the first thing you should try is to comment this out
 */
/*
 EmberApp.prototype.addonTreesFor = function (type) {
 return this.project.addons.map(function (addon) {
 if (addon.treeFor) {
 var tree = addon.treeFor(type);

 if (tree) {
 // uncomment to see the files available to be filtered out
 // tree = stew.log(tree, {output: 'tree'});
 tree = stew.rm(tree,
 '**!/components/rl-dropdown*.{js,hbs}'
 );
 }

 return tree;
 }
 }).filter(Boolean);
 };
 */

module.exports = function (defaults) {
	const inlineScriptsPath = 'app/inline-scripts/';
	const app = new EmberApp(defaults, {
		autoprefixer: {
			browsers: ['last 2 version', 'last 3 iOS versions', '> 1%'],
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
			replaceExtensions: ['html', 'css', 'js', 'hbs'],
			// FIXME
			// prepend: 'http://mobile-wiki.nocookie.net/mobile-wiki/'
		},
		inlineContent: {
			'mediawiki-globals': `${inlineScriptsPath}mediawiki-globals.js`,
			'get-from-shoebox': `${inlineScriptsPath}get-from-shoebox.js`,
			'geo-cookie': `${inlineScriptsPath}geo-cookie.js`,
			'load-script': `${inlineScriptsPath}load-script.js`,
			'tracking-quantcast': `${inlineScriptsPath}tracking-quantcast.js`,
			'tracking-comscore': `${inlineScriptsPath}tracking-comscore.js`,
			'measure-first-render': `${inlineScriptsPath}measure-first-render.html`,
			'load-svg': `${inlineScriptsPath}load-svg.js`,
			'tracking-ivw3': `${inlineScriptsPath}tracking-ivw3.js`,
			'tracking-nielsen': `${inlineScriptsPath}tracking-nielsen.js`,
			'tracking-netzathleten': `${inlineScriptsPath}tracking-netzathleten.js`,
			'tracking-ua-init': `${inlineScriptsPath}tracking-ua-init.js`,
			'inline-scripts-transpiled': `dist/mobile-wiki/assets/vendor/inline-scripts-transpiled.js`
		},
		outputPaths: {
			app: {
				css: {
					app: '/assets/app.css'
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
				// This duplicates build-common-symbols task but we still want to do it
				// as there is no easy way to use external rev-manifest.json in here
				{
					sourceDirs: '../common/public/symbols',
					outputFile: '/assets/common.svg'
				}
			]
		}
	});

	if (!process.env.EMBER_CLI_FASTBOOT) {
		// Files below are concatenated to assets/vendor.js
		app.import(app.bowerDirectory + '/fastclick/lib/fastclick.js');
		app.import(app.bowerDirectory + '/hammerjs/hammer.js');
		app.import(app.bowerDirectory + '/headroom.js/dist/headroom.js');
		app.import(app.bowerDirectory + '/jquery.cookie/jquery.cookie.js');
		app.import(app.bowerDirectory + '/ember-hammer/ember-hammer.js');
		app.import(app.bowerDirectory + '/weppy/dist/weppy.js');
		app.import(app.bowerDirectory + '/visit-source/dist/visit-source.js');
		app.import(app.bowerDirectory + '/script.js/dist/script.js');
	}
	app.import(app.bowerDirectory + '/vignette/dist/vignette.js');

	if (app.env === 'test') {
		// Fix for PhantomJS errors
		app.import(app.bowerDirectory + '/es5-shim/es5-shim.min.js');
	}

	// Assets which are lazy loaded
	const designSystemAssets = new Funnel(app.bowerDirectory + '/design-system/dist/svg/sprite.svg', {
			destDir: 'assets/design-system.svg'
		}),
		designSystemI18n = new Funnel('node_modules/design-system-i18n/i18n', {
			destDir: 'locales'
		});

	// Compile scripts which live outside of the Ember app
	let inlineScriptsTree = esTranspiler(`${inlineScriptsPath}es6`);

	inlineScriptsTree = concat(inlineScriptsTree, {
		inputFiles: ['simple-extend.js', 'tracking-ua.js'],
		outputFile: 'assets/vendor/inline-scripts-transpiled.js',
		sourceMapConfig: {
			enabled: false
		}
	});

	if (app.env === 'production') {
		inlineScriptsTree = uglify(inlineScriptsTree);
	}

	return BroccoliMergeTrees([
		inlineScriptsTree,
		app.toTree([
			designSystemAssets,
			designSystemI18n
		])], {
		// Without it there is `Merge error: file assets/vendor/inline-scripts.js exists in tmp/...`
		overwrite: true
	});
};
