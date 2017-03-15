import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('alert-notifications', 'Unit | Component | alert notifications', {
	unit: true
});

test('Dismissing alert', function (assert) {
	const alertOne = {
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
		alerts: Ember.A([
			alertOne,
			alertTwo
		])
	});

	component.send('dismissAlert', alertOne);
	assert.deepEqual(component.get('alerts'), Ember.A([alertTwo]), 'First alert should be removed');
});
