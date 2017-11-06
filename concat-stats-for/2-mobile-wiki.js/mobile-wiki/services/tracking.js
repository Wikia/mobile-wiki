define('mobile-wiki/services/tracking', ['exports', 'mobile-wiki/config/environment', 'mobile-wiki/utils/extend'], function (exports, _environment, _extend) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Service = Ember.Service;
	var service = Ember.inject.service;
	var set = Ember.set;
	var get = Ember.get;
	exports.default = Service.extend({
		fastboot: service(),
		wikiVariables: service(),
		config: {},

		init: function init() {
			this._super.apply(this, arguments);

			if (!this.get('fastboot.isFastBoot')) {
				return;
			}

			// Extend defaults from the config file with config from wiki variables
			// It's enough for most trackers
			var config = (0, _extend.default)({}, _environment.default.tracking, this.get('wikiVariables.tracking'));

			config = this.setupComscore(config);
			config = this.setupNielsen(config);

			this.get('fastboot.shoebox').put('tracking', config);

			this.set('config', config);
		},
		setupComscore: function setupComscore(config) {
			if (get(config, 'comscore.c7Value')) {
				var request = this.get('fastboot.request');
				var requestUrl = request.get('protocol') + '://' + request.get('host') + request.get('path');
				var c7 = '' + requestUrl + (requestUrl.indexOf('?') !== -1 ? '&' : '?') + (get(config, 'comscore.keyword') + '=' + get(config, 'comscore.c7Value'));

				set(config, 'comscore.c7', encodeURIComponent(c7));
			}

			return config;
		},
		setupNielsen: function setupNielsen(config) {
			set(config, 'nielsen.section', get(config, 'vertical'));
			set(config, 'nielsen.dbName', this.get('wikiVariables.dbName'));

			return config;
		}
	});
});