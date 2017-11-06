define('mobile-wiki/helpers/duration', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Helper.helper(function (params) {
		var value = params[0],
		    hours = Math.floor(value / 3600),
		    minutes = Math.floor((value - hours * 3600) / 60),
		    seconds = Math.floor(value - hours * 3600 - minutes * 60);

		var duration = '';

		// If duration is below 0 seconds it means corrupted data, we don't want to display it
		// Also return early for 0 seconds
		if (value <= 0) {
			return '00:00';
		}

		if (hours > 0) {
			duration += '' + (hours < 10 ? '0' : '') + hours + ':';
		}

		duration += '' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

		return duration;
	});
});