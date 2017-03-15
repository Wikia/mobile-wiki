/*jshint node:true*/

module.exports = {
	name: 'fastboot-require',

	contentFor: function (type, context) {
		// We use ember-derequire to rename all define to mefine and require to mequire
		// This is not being done for Fastboot's code because it's in node_modules/fastboot and not vendor.js
		// Fastboot has `ctx.require()` hardcoded and it fails as there is no require defined
		//
		// Because of this we need to somehow restore require for Fastboot only
		// For unknown reason using the following option disables derequire only for app.js but not vendor.js:
		// `derequire: { enabled: !process.env.EMBER_CLI_FASTBOOT }`
		//
		// This here uses deprecated hook which restores require and define at the end of fastboot/vendor.js
		// It would be better to use process.env.EMBER_CLI_FASTBOOT but it's not set in contentFor
		//
		// TODO this should be removed together with derequire when we start using AdEngine3
		if (type === 'vendor-suffix' && context.APP.autoboot === false) {
			return `window.require = mequire; window.define = mefine;`;
		}
	}
};
