import Ember from 'ember';
import FandomPostsModel from '../models/fandom-posts';
import {trackExperiment, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	experimentName: 'RECIRCULATION_MERCURY_FOOTER',

	init() {
		this._super(...arguments);

		const model = FandomPostsModel.create({
			type: this.get('type')
		});

		model.load();
		this.set('model', model);
	},

	didReceiveAttrs() {
		this._super(...arguments);
		const posts = this.get('posts');

		if (posts) {
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
