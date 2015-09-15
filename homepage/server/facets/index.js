/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

'use strict';

var deepExtend = require('deep-extend'),
	util = require('../util'),
    hubConfig = util.readJsonConfigSync('static/hub_config.json'),
	popularItemConfig = util.readJsonConfigSync('static/popular.json');

function index(request, reply) {
    var locale = util.getUserLocale(request),
        data = deepExtend({
			title: 'ウィキア・ジャパン',
			carousel: util.getLocalizedHubData(hubConfig, locale),
			popular: util.preprocessPopularData(popularItemConfig)
		}, util.getGlobalData());

    return reply.view('index', data);
}

module.exports = index;
