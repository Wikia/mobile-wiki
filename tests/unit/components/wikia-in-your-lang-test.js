import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('wikia-in-your-lang', 'Unit | Component | wikia-in-your-lang', {
	unit: true,
});

test('createAlert', function (assert) {
	const componentMock = this.subject();

	componentMock.clearNotifications();

	assert.equal(componentMock.alertNotifications.length, 0, 'should have no alert');

	componentMock.createAlert({
		message: 'hello',
		nativeDomain: 'wikia.com'
	});
	assert.equal(componentMock.alertNotifications.length, 1, 'should have 1 alert');
	assert.equal(componentMock.alertNotifications[0].message, 'hello', 'should be the created alert');
});
