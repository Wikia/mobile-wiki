import Ember from 'ember';
import {trackExperiment, trackActions} from 'common/utils/track';

export default Ember.Mixin.create({
	isLoading: false,
	externalLink: false,
	experimentName: '',
	label: '',

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
