import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';

export default Ember.Component.extend({
	classNames: ['discussion-category-select-tooltip-wrapper'],

	wasSeen: false, //Boolean(localStorageConnector.getItem('discussionCategorySelectTooltipSeen')),

	didInsertElement() {
		localStorageConnector.setItem('discussionCategorySelectTooltipSeen', true);
	}
});
