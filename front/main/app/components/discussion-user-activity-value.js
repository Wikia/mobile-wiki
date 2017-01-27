import Ember from 'ember';

export default Ember.Component.extend({

	classNames: ['user-activity-value'],

	displayedValue: Ember.computed('value', function () {
		return this.get('value');
	}),

	iconClassNames: Ember.computed('iconClass', function () {
		const iconClass = this.get('iconClass');
		let classNames = 'user-activity-icon';

		if (iconClass) {
			classNames += ` ${iconClass}`;
		}

		return classNames;
	}),

	// showing and hiding the tooltip

	/**
	 * @private
	 */
	hoovering: false,

	showTooltip: Ember.computed('value', 'hoovering', function () {
		return this.get('hoovering') && this.get('value') >= 1000;
	}),

	mouseEnter() {
		this.set('hoovering', true);
		return true;
	},

	mouseLeave() {
		this.set('hoovering', false);
		return true;
	},

});
