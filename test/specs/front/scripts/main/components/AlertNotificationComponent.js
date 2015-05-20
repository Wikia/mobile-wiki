moduleForComponent('alert-notification', 'AlertNotificationComponent');

test('Dismissing alert', function () {
	var alertOne = { type: 'success', message: 'Success message' },
		alertTwo = { type: 'error', message: 'Error message' },
		component = this.subject({
			alerts: Ember.A([
				alertOne,
				alertTwo
			]),
			alert: alertOne
		});

	Ember.run(function () {
		component.send('close');
		deepEqual(component.get('alerts'), Ember.A([alertTwo]), 'First alert should be removed');
	});
});
