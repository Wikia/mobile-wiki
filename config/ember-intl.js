module.exports = function (/* env */) {
	return {
		/**
		* prevents the translations from being bundled with the application code.
		* This enables asynchronously loading the translations for the active locale
		* by fetching them from the asset folder of the build.
		*
		* See: https://github.com/jasonmit/ember-intl/blob/master/docs/asynchronously-loading-translations.md
		*
		* @property publicOnly
		* @type {Boolean}
		* @default "false"
		*/
		publicOnly: false
	};
};
