import Ember from 'ember';
import ShareFeatureComponent from './share-feature';

export default ShareFeatureComponent.extend({

	classNames: ['discussion-dialog', 'discussion-share-dialog'],

	actions: {
		onCancel() {
			this.set('show', false);
		},
	}
});
