import Ember from 'ember';

export default Ember.Component.extend({

	classNames: ['user-activity-value'],

	computedValue: Ember.computed('value', function () {
		const value = this.get('value');
		return value <= 999 ? value.toString() : '999+';
	}),

	iconClassNames: Ember.computed('iconClass', function () {
		const iconClass = this.get('iconClass');
		let classNames = 'user-activity-icon';
		if(iconClass) {
			classNames += ` ${iconClass}`;
		}
		return classNames;
	})

});
