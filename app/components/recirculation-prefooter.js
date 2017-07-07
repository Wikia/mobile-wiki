import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import {track, trackActions} from '../utils/track';

const {Component, on, run, inject, $} = Ember,
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
							}).slice(0, recircItemsCount)
					});

					run.scheduleOnce('afterRender', () => {
						liftigniter.setupTracking(
							this.$().find('.recirculation-prefooter__item'),
							config.widget,
							'LI'
						);
					});
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
