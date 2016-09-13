/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var util = require('../util');

function companyInfo(request, reply) {
	var data = {
		title: '会社概要'
	};

	util.renderWithGlobalData(request, reply, data, 'companyinfo');
}

module.exports = companyInfo;
