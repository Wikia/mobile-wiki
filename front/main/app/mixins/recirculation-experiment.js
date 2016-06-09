import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import {trackExperiment, trackActions} from 'common/utils/track';

export default Ember.Mixin.create(
InViewportMixin,
{
	classNameBindings: ['label'],
	classNames: 'recirculation-experiment',
	experimentName: '',
	externalLink: false,
	isLoading: false,
	shouldBeLoaded: false,
	label: '',

	/**
	 * @returns {void}
	 */
	didEnterViewport() {
		this.set('shouldBeLoaded', true);
	},

	items: Ember.computed('model.items', 'shouldBeLoaded', function () {
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

	trackImpression() {
		trackExperiment(this.get('experimentName'), {
			action: trackActions.impression,
			category: 'recirculation',
			label: this.get('label')
		});
	},

	actions: {
		trackExperimentClick(url) {
			trackExperiment(this.get('experimentName'), {
				action: trackActions.click,
				category: 'recirculation',
				label: this.get('label')
			});

			if (this.get('externalLink')) {
				this.set('isLoading', true);
				setTimeout(() => {
					window.location.assign(url);
				}, 200);
			}
		}
	}

});
