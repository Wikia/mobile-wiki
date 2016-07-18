/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 *
 * @param {object} context
 * @param {object} link
 * @returns {string}
 */
module.exports = function globalFooterLink(context, link) {
	const templateCode = require('fs').readFileSync(
			`${__dirname}/../_partials/global-footer/global-footer-${link.type}.hbs`, 'utf8'
		),
		template = require('handlebars').compile(templateCode);

	context.model = link;

	return template(context);
};
