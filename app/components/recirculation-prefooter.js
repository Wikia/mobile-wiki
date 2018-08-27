import { defer } from 'rsvp';
import fetch from 'fetch';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import InViewportMixin from 'ember-in-viewport';
import Thumbnailer from '../modules/thumbnailer';
import { normalizeThumbWidth } from '../utils/thumbnail';
import { track, trackActions } from '../utils/track';

const recircItemsCount = 10;
const config = {
	// we load twice as many items as we want to display because we need to filter out those without thumbnail
	max: recircItemsCount * 2,
	widget: 'wikia-impactfooter',
	source: 'fandom',
	opts: {
		resultType: 'cross-domain',
		domainType: 'fandom.wikia.com',
	},
};

export default Component.extend(
	InViewportMixin,
	{
		wdsLiftigniter: service(),
		i18n: service(),
		logger: service(),
		ads: service(),

		classNames: ['recirculation-prefooter'],
		classNameBindings: ['items:has-items'],

		listRendered: null,

		init() {
			this._super(...arguments);

			const viewportTolerance = 100;

			this.setProperties({
				viewportTolerance: {
					top: viewportTolerance,
					bottom: viewportTolerance,
					left: 0,
					right: 0,
				},
				intersectionThreshold: 0,
				listRendered: defer(),
			});

			this.get('ads').addWaitFor('RECIRCULATION_PREFOOTER', this.get('listRendered.promise'));
		},

		actions: {
			postClick(post, index) {

				const labelParts = ['footer', `slot-${index + 1}`, post.source];

				track({
					action: trackActions.click,
					category: 'recirculation',
					label: labelParts.join('='),
				});

				run.later(() => {
					window.location.assign(post.url);
				}, 200);
			},
		},

		fetchPlista() {
			const width = normalizeThumbWidth(window.innerWidth);
			const height = Math.round(width / (16 / 9));
			const plistaURL = `https://farm.plista.com/recommendation/?publickey=845c651d11cf72a0f766713f&widgetname=api`
				+ `&count=1&adcount=1&image[width]=${width}&image[height]=${height}`;
			return fetch(plistaURL)
				.then(response => response.json())
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
					isPlista: true,
				};
			}

			return undefined;
		},

		fetchLiftIgniterData() {
			const liftigniter = this.wdsLiftigniter;

			liftigniter
				.getData(config)
				.then((data) => {
					this.set('items', data.items.filter(item => item.hasOwnProperty('thumbnail') && item.thumbnail)
						.slice(0, recircItemsCount)
						.map((item) => {
							item.thumbnail = Thumbnailer.getThumbURL(item.thumbnail, {
								mode: Thumbnailer.mode.scaleToWidth,
								width: normalizeThumbWidth(window.innerWidth),
							});

							return item;
						}));

					run.scheduleOnce('afterRender', () => {
						if (!this.isDestroyed) {
							liftigniter.setupTracking(
								this.element.querySelectorAll('.recirculation-prefooter__item'),
								config.widget,
								'LI',
							);
							this.get('listRendered').resolve();
						}
					});
				});

			track({
				action: trackActions.impression,
				category: 'recirculation',
				label: 'footer',
			});
		},

		didEnterViewport() {
			if (M.getFromHeadDataStore('noExternals')) {
				return;
			}

			M.trackingQueue.push((isOptedIn) => {
				if (isOptedIn) {
					this.fetchLiftIgniterData();
				}
			});
		},
	},
);
