import Ember from 'ember';

export default Ember.Component.extend({

	classNames: ['user-activity-value'],

	iconClassNames: Ember.computed('iconClass', function () {
		const iconClass = this.get('iconClass');
		let classNames = 'user-activity-icon';
		if(iconClass) {
			classNames += ` ${iconClass}`;
		}
		return classNames;
	})

});
