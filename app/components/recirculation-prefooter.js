import { defer } from 'rsvp';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { run } from '@ember/runloop';
import InViewportMixin from 'ember-in-viewport';
import Thumbnailer from '../modules/thumbnailer';
import { normalizeThumbWidth } from '../utils/thumbnail';
import { track, trackActions } from '../utils/track';
import { normalizeToUnderscore } from '../utils/string';

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
		router: service(),
		wikiVariables: service(),

		classNames: ['recirculation-prefooter'],
		classNameBindings: ['items:has-items'],

		listRendered: null,
		wikiName: reads('wikiVariables.siteName'),

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

			articleClick(title) {
				this.get('router').transitionTo('wiki-page', encodeURIComponent(normalizeToUnderscore(title)));
			},
		},

		fetchTopArticles() {
			this.set('topArticles', [{ id: 502844, title: 'Snoke', ns: 0, url: '/wiki/Snoke', revision: { id: 7811257, user: 'Lord KOT', user_id: 1525898, timestamp: '1535291345' }, comments: 0, type: 'article', abstract: ', a Force-sensitive humanoid alien male, was the Supreme Leader of the First Order and a powerful practitioner...', thumbnail: 'https://vignette.wikia.nocookie.net/starwars/images/9/9d/SnokeTLJ.png/revision/latest/window-crop/width/90/x-offset/0/y-offset/0/window-width/1242/window-height/1242?cb=20170910213521', original_dimensions: { width: '1242', height: '1721' }, thumbnailSize: 'small', date: 'August 26, 2018', index: 1 }, { id: 453246, title: 'Ahsoka Tano', ns: 0, url: '/wiki/Ahsoka_Tano', revision: { id: 7789645, user: 'Adamwankenobi', user_id: 4888, timestamp: '1534159217' }, comments: 0, type: 'article', abstract: ', nicknamed "Snips" by her Master and known as "Ashla" after the Clone Wars, was a Jedi Padawan who...', thumbnail: 'https://vignette.wikia.nocookie.net/starwars/images/3/32/Plo_discovers_Ahsoka.png/revision/latest/window-crop/width/90/x-offset/393/y-offset/0/window-width/817/window-height/816?cb=20131019051150', original_dimensions: { width: '1600', height: '816' }, thumbnailSize: 'small', date: 'August 13, 2018', index: 2 }, { id: 452390, title: 'Anakin Skywalker', ns: 0, url: '/wiki/Anakin_Skywalker', revision: { id: 7808517, user: 'DarthRuiz30', user_id: 7090787, timestamp: '1535233596' }, comments: 0, type: 'article', abstract: ', a Force-sensitive human male, was a Jedi Knight of the Galactic Republic, a hero of the Clone Wars...', thumbnail: 'https://vignette.wikia.nocookie.net/starwars/images/6/6f/Anakin_Skywalker_RotS.png/revision/latest/window-crop/width/90/x-offset/0/y-offset/0/window-width/819/window-height/819?cb=20130621175844', original_dimensions: { width: '819', height: '1024' }, thumbnailSize: 'small', date: 'August 25, 2018', index: 3 }]);
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

			this.fetchTopArticles();
		},
	},
);
