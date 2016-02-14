import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['sidebar-content-padding', 'edit-item-row'],
	isHelpVisible: false,
	labelValue: Ember.computed.oneWay('item.data.label'),
	maxLabelLength: 25,

	/**
	 * once the item.data.label changes, update labelValue
	 * to ensure they're always in sync, also when switching between
	 * infobox data rows
	 *
	 * @return {void}
	 */
	currentItemObserver: Ember.observer('item.data.label', function () {
		this.set('labelValue', this.get('item.data.label'));
	}),

	labelTextLenghtObserver: Ember.observer('labelValue', function () {
		const maxLabelLength = this.get('maxLabelLength');
		let label = this.get('labelValue');

		if (label.length > maxLabelLength) {
			// maybe some info that label is too long?
			label = label.substring(0, maxLabelLength);
		}

		this.get('editRowItem')(this.get('item'), label);
	}),

	actions: {
		showHelp() {
			this.set('isHelpVisible', true);
		}
	}
});
