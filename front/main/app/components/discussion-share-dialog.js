import Ember from 'ember';
import ShareFeatureComponent from './share-feature';

export default ShareFeatureComponent.extend({

	classNames: ['discussion-dialog', 'discussion-share-dialog'],

	isVisible: Ember.computed.alias('show'),

	actions: {
		onCancel() {
			this.set('show', false);
		},
	}
});
