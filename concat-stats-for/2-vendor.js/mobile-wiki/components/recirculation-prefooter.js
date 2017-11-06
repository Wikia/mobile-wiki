define('mobile-wiki/components/recirculation-prefooter', ['exports', 'ember-in-viewport', 'mobile-wiki/modules/thumbnailer', 'mobile-wiki/utils/thumbnail', 'mobile-wiki/utils/track'], function (exports, _emberInViewport, _thumbnailer, _thumbnail, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Component = Ember.Component;
	var computed = Ember.computed;
	var on = Ember.on;
	var run = Ember.run;


	var recircItemsCount = 10,
	    config = {
		// we load twice as many items as we want to display because we need to filter out those without thumbnail
		max: recircItemsCount * 2,
		widget: 'wikia-impactfooter',
		source: 'fandom',
		opts: {
			resultType: 'cross-domain',
			domainType: 'fandom.wikia.com'
		}
	};

	exports.default = Component.extend(_emberInViewport.default, {
		classNames: ['recirculation-prefooter'],
		isVisible: false,
		liftigniter: service(),
		i18n: service(),
		logger: service(),
		hasNoLiftigniterSponsoredItem: computed('items', function () {
			return !this.get('items').some(function (item) {
				return item.presented_by;
			});
		}),
		shouldShowPlista: computed('hasNoLiftigniterSponsoredItem', function () {
			return ['AU', 'NZ'].indexOf(M.geo.country) > -1 && this.get('hasNoLiftigniterSponsoredItem');
		}),
		fetchPlista: function fetchPlista() {
			var width = (0, _thumbnail.normalizeThumbWidth)(window.innerWidth);
			var height = Math.round(width / (16 / 9));
			var plistaURL = 'https://farm.plista.com/recommendation/?publickey=845c651d11cf72a0f766713f&widgetname=api' + ('&count=1&adcount=1&image[width]=' + width + '&image[height]=' + height);
			return fetch(plistaURL).then(function (response) {
				return response.json();
			}).then(function (data) {
				if (data.length) {
					return data[0];
				} else {
					throw new Error('We haven\'t got Plista!');
				}
			});
		},
		mapPlista: function mapPlista(item) {
			if (item) {
				return {
					meta: 'wikia-impactfooter',
					thumbnail: item.img,
					title: item.title,
					url: item.url,
					presented_by: 'Plista',
					isPlista: true
				};
			}
		},
		didEnterViewport: function didEnterViewport() {
			var _this = this;

			var liftigniter = this.get('liftigniter');

			if (M.getFromShoebox('runtimeConfig.noExternals')) {
				return;
			}

			liftigniter.getData(config).then(function (data) {
				_this.setProperties({
					isVisible: true,
					items: data.items.filter(function (item) {
						return item.hasOwnProperty('thumbnail') && item.thumbnail;
					}).slice(0, recircItemsCount).map(function (item) {
						item.thumbnail = _thumbnailer.default.getThumbURL(item.thumbnail, {
							mode: _thumbnailer.default.mode.scaleToWidth,
							width: (0, _thumbnail.normalizeThumbWidth)(window.innerWidth)
						});

						return item;
					})
				});

				run.scheduleOnce('afterRender', function () {
					liftigniter.setupTracking(_this.$().find('.recirculation-prefooter__item'), config.widget, 'LI');
				});

				if (_this.get('shouldShowPlista')) {
					_this.fetchPlista().then(_this.mapPlista).then(function (item) {
						if (item.thumbnail) {
							var newItems = _this.get('items');

							newItems.splice(1, 0, item);
							newItems.pop();
							_this.set('items', newItems);
							_this.notifyPropertyChange('items');
						}
					}).catch(function (error) {
						_this.get('logger').info('Plista fetch failed', error);
					});
				}
			});

			(0, _track.track)({
				action: _track.trackActions.impression,
				category: 'recirculation',
				label: 'footer'
			});
		},


		viewportOptionsOverride: on('willRender', function () {
			var viewportTolerance = 1000;

			this.set('viewportTolerance', {
				top: viewportTolerance,
				bottom: viewportTolerance
			});
		}),

		actions: {
			postClick: function postClick(post, index) {

				var labelParts = ['footer', 'slot-' + (index + 1), post.source, post.isVideo ? 'video' : 'not-video'];

				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'recirculation',
					label: labelParts.join('=')
				});

				run.later(function () {
					window.location.assign(post.url);
				}, 200);
			}
		}
	});
});