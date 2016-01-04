import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('alert-notifications', 'Unit | Component | alert notifications', {
	unit: true
});

test('Dismissing alert', function (assert) {
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
		assert.deepEqual(component.get('alerts'), Ember.A([alertTwo]), 'First alert should be removed');
	});
});
