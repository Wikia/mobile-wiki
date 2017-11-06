define('mobile-wiki/tests/unit/components/alert-notifications-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('alert-notifications', 'Unit | Component | alert notifications', {
		unit: true
	});

	(0, _emberQunit.test)('Dismissing alert', function (assert) {
		var alertOne = {
			type: 'success',
			message: 'Success message',
			callbacks: {}
		},
		    alertTwo = {
			type: 'error',
			message: 'Error message',
			callbacks: {}
		},
		    component = this.subject();

		component.setProperties({
			alerts: Ember.A([alertOne, alertTwo])
		});

		component.send('dismissAlert', alertOne);
		assert.deepEqual(component.get('alerts'), Ember.A([alertTwo]), 'First alert should be removed');
	});
});