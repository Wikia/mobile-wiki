/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 * @author Gautam Bajaj <gbajaj@wikia-inc.com>
 */

'use strict';

var util = require('../util'),
	heroSliderConfig = util.readJsonConfigSync('static/hero_slider.json'),
	sliderConfig = util.readJsonConfigSync('static/sliders.json'),
	whatIsWikiaConfig = util.readJsonConfigSync('static/whatiswikia.json'),
	joinWikiaConfig = util.readJsonConfigSync('static/joinwikia.json');

/**
 * Postprocess slider config to include groupedEntries, with pairs of slides grouped together
 * @param config
 * @returns {object}
 */
function postprocessSliderConfig(config) {
	var i, j, entry;

	for (i = 0; i < config.length; i++) {
		entry = config[i];
		entry.groupedEntries = [];

		for (j = 0; j < entry.entries.length; j+=2) {
			entry.groupedEntries.push({
				left: entry.entries[j],
				right: entry.entries[j+1],
			});
		}
	}

	return config;
}

function index(request, reply) {
	var data = {
		title: 'Wikia Japan',
		heroSlider: heroSliderConfig.data,
		sliders: postprocessSliderConfig(sliderConfig.data),
		whatIsWikia: whatIsWikiaConfig.data,
		joinWikia: joinWikiaConfig.data,
	};

	util.renderWithGlobalData(request, reply, data, 'index');
}

module.exports = index;
