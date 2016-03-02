import Ember from 'ember';
import FandomPostsModel from '../models/fandom-posts';
import {trackExperiment, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	experimentName: 'RECIRCULATION_MERCURY_FOOTER',

	init() {
		this._super();

		FandomPostsModel
			.create({
				type: this.get('type')
			})
			.load()
			.then((model) => {
				this.setProperties(model);
			});
	},

	didRender() {
		trackExperiment(this.get('experimentName'), {
			action: trackActions.impression,
			category: 'recirculation',
			label: 'footer'
		});
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
