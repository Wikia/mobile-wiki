import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import {track, trackActions} from '../utils/track';

const {Component, on, run, inject, $} = Ember;
const maxItems = 9;

export default Component.extend(
	InViewportMixin,
	{
		classNames: ['recirculation-prefooter'],
		isVisible: false,
		liftigniter: inject.service(),

		config: {
			//we load twice as many items as we want to display because we need to filter out those without thumbnail
			max: maxItems * 2,
			widget: 'wikia-impactfooter',
			source: 'fandom',
			opts: {
				resultType: 'cross-domain',
				domainType: 'fandom.wikia.com'
			}
		},

		didEnterViewport() {
			const config = this.get('config'),
				liftigniter = this.get('liftigniter');

			liftigniter
				.getData(config)
				.done((data) => {
					this.setProperties({
						isVisible: true,
						items: data.items
							.filter((item) => {
								return item.hasOwnProperty('thumbnail') && item.thumbnail;
							}).slice(0, maxItems)
					});

					run.scheduleOnce('afterRender', () => {
						console.log(this.$().find('.recirculation-prefooter__item'));
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
