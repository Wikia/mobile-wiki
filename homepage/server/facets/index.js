/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

'use strict';

var util = require('../util'),
    hubConfig = util.readJsonConfigSync('static/hub_config.json');

function index(request, reply) {
    var locale = util.getUserLocale(request),
        data = {
            title: 'ウィキア・ジャパン',
            carousel: util.getLocalizedHubData(hubConfig, locale)
        };

    return reply.view('index', data);
}

module.exports = index;
