import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['sidebar-content-padding'],
	isHelpVisible: false,
	labelValue: Ember.computed.oneWay('item.data.label'),

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
		const label = this.get('labelValue');

		this.get('editRowItem')(this.get('item'), label);
	}),

	actions: {
		showHelp() {
			this.set('isHelpVisible', true);
		}
	}
});
