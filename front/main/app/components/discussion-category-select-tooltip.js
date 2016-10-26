import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';

export default Ember.Component.extend({
	arrowDirection: 'down',
	classNames: ['discussion-category-select-tooltip-wrapper', 'discussion-tooltip-wrapper'],
	layoutName: 'components/discussion-tooltip',

	text: i18n.t('main.category-select-tooltip-text', {ns: 'discussion'}),

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

	willRender() {
		this._super(...arguments);
		this.set('wasSeen', Boolean(localStorageConnector.getItem('discussionCategorySelectTooltipSeen')));
	}
});
