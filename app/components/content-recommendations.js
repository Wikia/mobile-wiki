import Ember from 'ember';
import {trackExperiment, trackActions} from '../utils/track';

export default Ember.Component.extend({
	experimentName: 'RECIRCULATION_MERCURY_FOOTER',

	didReceiveAttrs() {
		this._super(...arguments);
		const pages = this.get('pages');

		if (pages) {
			trackExperiment(this.get('experimentName'), {
				action: trackActions.impression,
				category: 'recirculation',
				label: 'footer'
			});
		}
	},

	actions: {
		trackExperimentClick() {
			trackExperiment(this.get('experimentName'), {
				action: trackActions.click,
				category: 'recirculation',
				label: 'footer'
			});
		}
	}
});
