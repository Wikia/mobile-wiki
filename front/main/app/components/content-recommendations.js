import Ember from 'ember';
import {trackExperiment, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	experimentName: 'RECIRCULATION_MERCURY_FOOTER',

	trackImpression() {
		trackExperiment(this.get('experimentName'), {
			action: trackActions.impression,
			category: 'recirculation',
			label: 'footer'
		});
	},

	didRender() {
		const pages = this.get('pages');

		if (pages) {
			Ember.run.throttle(this, 'trackImpression', 200);
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
