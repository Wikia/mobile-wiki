/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var util = require('../util');

function companyInfo(request, reply) {
	var data = {
		title: 'Wikia Japan'
	};

	util.renderWithGlobalData(request, reply, data, 'companyinfo');
}

module.exports = companyInfo;
