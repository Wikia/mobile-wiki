const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const fastbootTransform = require('fastboot-transform');
const path = require('path');

module.exports = {
	name: 'fastboot-import',

	getTree(filePath, file, runInFastbootAlso) {
		const tree = new Funnel(path.dirname(require.resolve(filePath)), {
			files: [file],
		});

		if (runInFastbootAlso) {
			return tree;
		}

		return fastbootTransform(tree);
	},

	/**
	 * Hook to read all browser specific libraries from node_modules and wrap them up with FastBoot check.
	 * They by default are under the vendor tree.
	 *
	 * @param {Broccoli} tree
	 */
	treeForVendor(tree) {
		let trees = [];

		if (tree) {
			trees.push(tree);
		}

		trees.push(this.getTree('vignette/dist/vignette.js', 'vignette.js', true));
		trees.push(this.getTree('visit-source/dist/visit-source.js', 'visit-source.js'));
		trees.push(this.getTree('weppy/dist/weppy.js', 'weppy.js'));
		trees.push(this.getTree('jquery.cookie/jquery.cookie.js', 'jquery.cookie.js'));
		trees.push(this.getTree('scriptjs/dist/script.min.js', 'script.min.js'));

		return new Merge(trees);
	},

	included(app) {
		this._super.included(app);

		// import libraries into vendor.js that was merged with the vendor trees.
		// In browser the library will be eval'd and run
		// In fastboot, the library will not be eval'd
		// Files below are concatenated to assets/vendor.js
		app.import('vendor/jquery.cookie.js');
		app.import('vendor/weppy.js');
		app.import('vendor/visit-source.js');
		app.import('vendor/script.min.js');
		app.import('vendor/vignette.js');
	}
};

