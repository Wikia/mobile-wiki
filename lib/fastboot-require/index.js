const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');

module.exports = {
	name: 'fastboot-require',

	treeForVendor(tree) {
		const restoreRequire = new Funnel(__dirname, {
			files: [
				'restore-require.js',
			],
		});

		return tree ? new Merge(restoreRequire, tree) : restoreRequire;
	},

	included(app) {
		this._super.included(app);

		// TODO this should be removed together with derequire when we start using AdEngine3
		// We use ember-derequire to rename all define to mefine and require to mequire
		// Fastboot has `ctx.require()` hardcoded and it fails as there is no require defined
		app.import(`vendor/restore-require.js`);
	}
};
