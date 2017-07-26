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

export default Component.extend(
	InViewportMixin,
	{
		classNames: ['recirculation-prefooter'],
		isVisible: false,
		liftigniter: inject.service(),
		i18n: inject.service(),
		hasNoLiftigniterSponsoredItem: computed('items', function () {
			return !this.get('items').some((item) => item.presented_by);
		}),
		isInRightCountry: false,
		shouldShowPlista: computed('hasNoLiftigniterSponsoredItem', function () {
			return ['AU', 'NZ'].indexOf(M.geo.country) > -1 && this.get('hasNoLiftigniterSponsoredItem');
		}),
		fetchPlista() {
			const plistaURL = 'http://farm.plista.com/recommendation/?publickey=845c651d11cf72a0f766713f&widgetname=api' +
							'&count=1&adcount=1&image[width]=583&image[height]=328';
			return fetch(plistaURL)
				.then((response) => response.json())
				.then((data) => {
					if (data.length) {
						return data[0];
					} else {
						throw new Error('We haven\'t got PLISTA!');
					}
				})
				.catch((error) => {
					// If Plista did not return anything, just don't add it to to items
				});
		},
		mapPlista(item) {
			return {
				meta: 'wikia-impactfooter',
				thumbnail: item.img,
				title: item.title,
				url: item.url,
				presented_by: item.brand,
				isPlista: true
			};
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

					if (this.get('shouldShowPlista')) {
						this.fetchPlista()
							.then(this.mapPlista)
							.then((item) => {
								if (item.thumbnail) {
									this.notifyPropertyChange('items');
									this.set('items.1', item);
								}
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
