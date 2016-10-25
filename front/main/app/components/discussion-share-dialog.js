import Ember from 'ember';
import ShareFeatureComponent from './share-feature';
import {track, trackActions} from '../utils/discussion-tracker';

export default ShareFeatureComponent.extend({

	classNames: ['discussion-dialog', 'discussion-share-dialog'],

	isVisible: Ember.computed.alias('show'),

	actions: {
		/**
		 * Delete category modal cancel method.
		 *
		 * @returns {void}
		 */
		onCancel() {
			this.set('show', false);
		},
	}
});
