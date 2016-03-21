import Ember from 'ember';
import FandomPostsModel from '../models/fandom-posts';
import {trackExperiment, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	experimentName: 'RECIRCULATION_MERCURY_FOOTER',

	init() {
		this._super(...arguments);

		this.model = FandomPostsModel.create({
			type: this.get('type')
		});

		this.model.load();
	},

	didReceiveAttrs() {
		this._super(...arguments);

		trackExperiment(this.get('experimentName'), {
			action: trackActions.impression,
			category: 'recirculation',
			label: 'footer'
		});
	},

	actions: {
		trackExperimentClick(url) {
			trackExperiment(this.get('experimentName'), {
				action: trackActions.click,
				category: 'recirculation',
				label: 'footer'
			});

			setTimeout(() => {
				window.location.assign(url);
			}, 100);
		}
	}
});
