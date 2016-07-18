/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 *
 * @param {object} context
 * @param {object} link
 * @returns {string}
 */
module.exports = function i18nHelper(context, link) {
	const globalFooterPath = `${__dirname}/../_partials/global-footer/global-footer-${link.type}.hbs`,
		globalFooter = require('fs').readFileSync(globalFooterPath, 'utf8'),
		template = require('handlebars').compile(globalFooter);

	context.model = link;

	return template(context);
};
