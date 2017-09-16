module.exports = {
	name: 'fastboot-require',

	included(app) {
		// TODO this should be removed together with derequire when we start using AdEngine3
		// We use ember-derequire to rename all define to mefine and require to mequire
		// Fastboot has `ctx.require()` hardcoded and it fails as there is no require defined
		app.import(`${__dirname}/restore-require.js`);
	}
};
