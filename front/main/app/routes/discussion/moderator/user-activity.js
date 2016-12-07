import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
		days: {
			refreshModel: true
		}
	},

	allowedDaysValues: [30, 90],

	isValidDaysValue(days) {
		return this.allowedDaysValues.indexOf(parseInt(days)) !== -1;
	},

	beforeModel(transition) {
		const days = transition.queryParams.days;

		if (!this.isValidDaysValue(days)) {
			this.transitionTo({
				queryParams: {
					days: this.get('allowedDaysValues.0')
				}
			})
		}
	},

	actions: {
		setDays(days) {
			this.transitionTo({queryParams: {
				days
			}});
		}
	}
});
