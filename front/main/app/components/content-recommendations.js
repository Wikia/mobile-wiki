import Ember from 'ember';
import {trackExperiment} from 'common/utils/abTesting';
import {trackActions} from 'common/utils/track';

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
		var pages = this.get('pages');
		if (pages) {
			Ember.run.throttle(this, 'trackImpression', 200);
		}
	},

	actions: {
		trackClick() {
			trackExperiment(this.get('experimentName'), {
				action: trackActions.click,
				category: 'recirculation',
				label: 'footer'
			});
		}
	}
});
