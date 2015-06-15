moduleForComponent('alert-notifications', 'AlertNotificationsComponent');

test('Dismissing alert', function () {
	var alertOne = { type: 'success', message: 'Success message' },
		alertTwo = { type: 'error', message: 'Error message' },
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
