import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';

export default Ember.Component.extend({
	classNames: ['discussion-category-select-tooltip-wrapper'],

	wasSeen: Boolean(localStorageConnector.getItem('discussionCategorySelectTooltipSeen')),

	isVisible: Ember.computed('wasSeen', 'shouldShowCategoryPicker', 'isEdit', 'isActive', 'showOverlayMessage',
		function () {
			return !this.get('wasSeen') && this.get('shouldShowCategoryPicker') &&
				!this.get('isEdit') && this.get('isActive') && !this.get('showOverlayMessage');
		}
	),

	wasSeenSetter: Ember.observer('category', 'isActive', function () {
		if (this.get('category')) {
			this.set('wasSeen', true);
			localStorageConnector.setItem('discussionCategorySelectTooltipSeen', true);
		}
	}),
});
