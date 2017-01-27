import Ember from 'ember';

export default Ember.Component.extend({

	classNames: ['user-activity-value'],

	iconClassNames: Ember.computed('iconClass', function () {
		const iconClass = this.get('iconClass');
		let classNames = 'user-activity-icon';

		if (iconClass) {
			classNames += ` ${iconClass}`;
		}

		return classNames;
	}),

	// showing and hiding the tooltip

	showTooltip: false,

	/**
	 * @private
	 */
	valueHasBeenShortened() {
		return this.get('value') >= 1000;
	},

	mouseEnter() {
		this.set('showTooltip', this.valueHasBeenShortened());
		return true;
	},

	mouseLeave() {
		this.set('showTooltip', false);
		return true;
	},

});
