import {test, moduleFor} from 'ember-qunit';

moduleFor('component:alert-notifications', {
	unit: true
});

test('Dismissing alert', function () {
	var alertOne = { type: 'success', message: 'Success message', callbacks: {} },
		alertTwo = { type: 'error', message: 'Error message', callbacks: {} },
		component = this.subject({
			alerts: Ember.A([
				alertOne,
				alertTwo
			])
		});

	Ember.run(function () {
		component.send('dismissAlert', alertOne);
		deepEqual(component.get('alerts'), Ember.A([alertTwo]), 'First alert should be removed');
	});
});
