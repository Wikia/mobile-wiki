var Handlebars = require('handlebars');
/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 *
 * @param {string} key
 * @param {{hash: string}} options
 * @returns {string}
 */
module.exports = function i18nHelper(context, link) {
	var fs = require('fs'),
		handlebars = fs.readFileSync(__dirname + '/../_partials/global-footer/global-footer-' + link.type + '.hbs', 'utf8'),
		template = Handlebars.compile(handlebars);

	context.model = link;

	return template(context);
};
