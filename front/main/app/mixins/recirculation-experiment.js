import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import {trackExperiment, trackActions} from 'common/utils/track';
import {getGroup} from 'common/modules/abtest';

export default Ember.Mixin.create(
	InViewportMixin,
	{
		classNameBindings: ['label', 'group'],
		classNames: 'recirculation-experiment',
		experimentName: '',
		externalLink: false,
		isLoading: false,
		shouldBeLoaded: false,
		label: '',

		group: Ember.computed('experimentName', function () {
			return getGroup(this.get('experimentName'));
		}),

		items: Ember.computed('model.items', function () {
			return this.get('model.items').map((item) => {
				if (this.get('externalLink')) {
					const params = {
						utm_source: 'wikia',
						utm_campaign: 'recirc',
						utm_medium: this.get('label'),
						utm_content: item.index + 1
					};

					Ember.set(item, 'url', `${item.url}?${Ember.$.param(params)}`);
				}

				return item;
			});
		}),

		/**
		 * A large tolerance is necessary because this component is larger than the viewport
		 * @returns {void}
		 */

		viewportOptionsOverride: Ember.on('didInsertElement', function () {
			if (this.get('model.items').length < 1) {
				return;
			}

			const elementHeight = this.$().innerHeight(),
				tolerance = elementHeight,
				afterRender = this.get('model.afterRender');

			if (tolerance > 0) {
				Ember.setProperties(this, {
					viewportTolerance: {
						top: tolerance,
						bottom: tolerance,
						left: 0,
						right: 0
					}
				});
			}

			if (afterRender) {
				afterRender.call(this.get('model'), this);
			}
		}),

		/**
		 * @returns {void}
		 */
		didEnterViewport() {
			this.set('shouldBeLoaded', true);
		},

		/**
		 * @returns {void}
		 */
		trackImpression() {
			trackExperiment(this.get('experimentName'), {
				action: trackActions.impression,
				category: 'recirculation',
				label: this.get('label')
			});
		},

		actions: {
			/**
			 * @param {string} url
			 *
			 * @returns {void}
			 */
			trackExperimentClick(url) {
				trackExperiment(this.get('experimentName'), {
					action: trackActions.click,
					category: 'recirculation',
					label: this.get('label')
				});

				this.set('isLoading', true);
				if (this.get('externalLink')) {
					setTimeout(() => {
						window.location.assign(url);
					}, 200);
				}
			}
		}
	}
);
