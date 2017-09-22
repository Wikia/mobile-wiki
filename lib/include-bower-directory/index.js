const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const fastbootTransform = require('fastboot-transform');
const path = require('path');
const existSync = require('exists-sync');

module.exports = {
	name: 'fastboot-import',

	/**
	 * Hook to read all browser specific libraries from bower and wrap them up with FastBoot check.
	 * They by default are under the vendor tree.
	 *
	 * @param {Broccoli} tree
	 */
	treeForVendor(tree) {
		let trees = [];

		if (tree) {
			trees.push(tree);
		}
		const app = this._findHost();
		const assetDir = path.join(this.project.root, app.bowerDirectory);

		if (existSync(assetDir)) {
			// Funnel the browser lib from bower with providing destDir as the lib (this is optional). If you don't
			// provide `destDir` it will default to `vendor/yourlib.js`. If you provide destDir it will default to:
			// `vendor/destDirName/yourlib.js`
			const browserTrees = fastbootTransform(new Funnel(assetDir, {
				files: [
					'hammerjs/hammer.js',
					'headroom.js/dist/headroom.js',
					'jquery.cookie/jquery.cookie.js',
					'ember-hammer/ember-hammer.js',
					'visit-source/dist/visit-source.js',
					'script.js/dist/script.min.js',
					'es5-shim/es5-shim.min.js'
				],
			}));
			trees.push(browserTrees);
		}

		return new Merge(trees);
	},

	included(app) {
		this._super.included(app);

		// import libraries into vendor.js that was merged with the vendor trees.
		// In browser the library will be eval'd and run
		// In fastboot, the library will not be eval'd
		// Files below are concatenated to assets/vendor.js
		app.import('vendor/hammerjs/hammer.js');
		app.import('vendor/headroom.js/dist/headroom.js');
		app.import('vendor/jquery.cookie/jquery.cookie.js');
		app.import('vendor/ember-hammer/ember-hammer.js');
		app.import('vendor/visit-source/dist/visit-source.js');
		app.import('vendor/script.js/dist/script.min.js');
		app.import(`${app.bowerDirectory}/vignette/dist/vignette.js`);

		if (app.env === 'test') {
			// Fix for PhantomJS errors
			app.import('vendor/es5-shim/es5-shim.min.js');
		}
	}
};

