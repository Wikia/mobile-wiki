/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

'use strict';

var util = require('../util'),
	heroSliderConfig = util.readJsonConfigSync('static/hero_slider.json'),
	sliderConfig = util.readJsonConfigSync('static/sliders.json'),
	whatIsWikiaConfig = util.readJsonConfigSync('static/whatiswikia.json');

function index(request, reply) {
	var data = {
		title: 'ウィキア・ジャパン',
		heroSlider: heroSliderConfig.data,
		sliders: sliderConfig.data,
		whatIsWikia: whatIsWikiaConfig.data,
	};

	util.renderWithGlobalData(request, reply, data, 'index');
}

module.exports = index;
