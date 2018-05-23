import fetch from 'fetch';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {computed} from '@ember/object';
import {run} from '@ember/runloop';
import InViewportMixin from 'ember-in-viewport';
import Thumbnailer from '../modules/thumbnailer';
import {normalizeThumbWidth} from '../utils/thumbnail';
import {track, trackActions} from '../utils/track';
import {task} from 'ember-concurrency';

const recircItemsCount = 10,
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
		liftigniter: service(),
		i18n: service(),
		logger: service(),

		classNames: ['recirculation-prefooter'],
		classNameBindings: ['items:has-items'],

		hasNoLiftigniterSponsoredItem: computed('items', function () {
			return !this.get('items').some((item) => item.presented_by);
		}),
		shouldShowPlista: computed('hasNoLiftigniterSponsoredItem', function () {
			return M.geo && ['AU', 'NZ'].indexOf(M.geo.country) > -1 && this.get('hasNoLiftigniterSponsoredItem');
		}),

		init() {
			this._super(...arguments);

			const viewportTolerance = 100;

			this.setProperties({
				viewportTolerance: {
					top: viewportTolerance,
					bottom: viewportTolerance,
					left: 0,
					right: 0
				},
				intersectionThreshold: 0
			});
		},

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
		},

		fetchPlista() {
			const width = normalizeThumbWidth(window.innerWidth);
			const height = Math.round(width / (16 / 9));
			const plistaURL = `https://farm.plista.com/recommendation/?publickey=845c651d11cf72a0f766713f&widgetname=api`
				+ `&count=1&adcount=1&image[width]=${width}&image[height]=${height}`;
			return fetch(plistaURL)
				.then((response) => response.json())
				.then((data) => {
					if (data.length) {
						return data[0];
					} else {
						throw new Error('We haven\'t got Plista!');
					}
				});
		},

		mapPlista(item) {
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

		fetchLiftIgniterData: task(function* () {
			const liftigniter = this.get('liftigniter');

			const data = yield liftigniter.getData(config);

			this.set('items', data.items.filter((item) => {
				return item.hasOwnProperty('thumbnail') && item.thumbnail;
			})
				.slice(0, recircItemsCount)
				.map((item) => {
					item.thumbnail = Thumbnailer.getThumbURL(item.thumbnail, {
						mode: Thumbnailer.mode.scaleToWidth,
						width: normalizeThumbWidth(window.innerWidth)
					});

					return item;
				}));

			run.scheduleOnce('afterRender', () => {
				if (!this.get('isDestroyed')) {
					liftigniter.setupTracking(
						this.element.querySelectorAll('.recirculation-prefooter__item'),
						config.widget,
						'LI'
					);
				}
			});

			if (this.get('shouldShowPlista')) {
				this.fetchPlista()
					.then(this.mapPlista)
					.then((item) => {
						if (item.thumbnail) {
							let newItems = this.get('items');

							newItems.splice(1, 0, item);
							newItems.pop();
							this.set('items', newItems);
							this.notifyPropertyChange('items');
						}
					})
					.catch((error) => {
						this.get('logger').info('Plista fetch failed', error);
					});
			}

			track({
				action: trackActions.impression,
				category: 'recirculation',
				label: 'footer'
			});
		}).drop(),

		didEnterViewport() {
			if (M.getFromHeadDataStore('noExternals') || !this.get('trackingStatus.hasUserTrackingConsent')) {
				return;
			}

			this.fetchLiftIgniterData();
		},
	}
);
