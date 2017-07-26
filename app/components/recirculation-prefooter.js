import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import Thumbnailer from '../modules/thumbnailer';
import {normalizeThumbWidth} from '../utils/thumbnail';
import {track, trackActions} from '../utils/track';

const {Component, computed, on, run, inject, $} = Ember,
	recircItemsCount = 10,
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

function fetchPlista() {

}

export default Component.extend(
	InViewportMixin,
	{
		classNames: ['recirculation-prefooter'],
		isVisible: false,
		liftigniter: inject.service(),
		i18n: inject.service(),
		hasNoLiftigniterSponsoredItem: true,
		isInRightCountry: false,
		shouldShowPlista: computed.and('hasNoLiftigniterSponsoredItem', 'isInRightCountry'),
		plistaSponsoredContent: [],
		fetchPlista() {
			const plistaURL = 'http://farm.plista.com/recommendation/?publickey=845c651d11cf72a0f766713f&widgetname=api' +
							'&count=1&adcount=1&image[width]=583&image[height]=328';
			return fetch(plistaURL)
				.then(response => {
					return response.json();
				})
				.then(data => {
					if (data) {
						return data[0];
					} else {
						throw new Error('We haven\'t got PLISTA!');
					}
				})
				.catch(error => {
					console.log(error);
				});
		},
		mapPlista(item) {
			if (typeof(item) !== 'undefined') {
				return {
					meta: 'wikia-impactfooter',
					source: 'plista',
					thumbnail: item.img || 'img',
					title: item.title || 'title',
					url: item.url || 'url',
					presented_by: item.brand || 'brand'
				};
			}
		},

		didEnterViewport() {
			const liftigniter = this.get('liftigniter');

			liftigniter
				.getData(config)
				.then((data) => {
					this.setProperties({
						isVisible: true,
						items: data.items
							.filter((item) => {
								return item.hasOwnProperty('thumbnail') && item.thumbnail;
							})
							.slice(0, recircItemsCount)
							.map((item) => {

								if (item.presented_by) {
									this.set('hasNoLiftigniterSponsoredItem', false);
								}

								item.thumbnail = Thumbnailer.getThumbURL(item.thumbnail, {
									mode: Thumbnailer.mode.scaleToWidth,
									width: normalizeThumbWidth(window.innerWidth)
								});

								return item;
							})
					});

					run.scheduleOnce('afterRender', () => {
						liftigniter.setupTracking(
							this.$().find('.recirculation-prefooter__item'),
							config.widget,
							'LI'
						);
					});

					this.set('isInRightCountry', (M.geo.country === 'AU') || (M.geo.country === 'NZ'));

					if (this.get('shouldShowPlista')) {
						this.fetchPlista()
							.then(this.mapPlista)
							.then((item) => {
								this.set('items.1', item);
							});
					}
				});

			track({
				action: trackActions.impression,
				category: 'recirculation',
				label: 'footer'
			});
		},

		viewportOptionsOverride: on('willRender', function () {
			const viewportTolerance = 1000;

			this.set('viewportTolerance', {
				top: viewportTolerance,
				bottom: viewportTolerance
			});
		}),

		actions: {
			postClick(post, index) {
				const labelParts = ['footer', `slot-${index + 1}`, post.source, post.isVideo ? 'video' : 'not-video'];

				track({
					action: trackActions.click,
					category: 'recirculation',
					label: labelParts.join('=')
				});

				run.later(() => {
					window.location.assign(post.url);
				}, 200);
			}
		}
	}
);
