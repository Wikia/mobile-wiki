import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Component | wikia-in-your-lang', (hooks) => {
	setupTest(hooks);

	test('createAlert', function (assert) {
		const componentMock = this.owner.factoryFor('component:wikia-in-your-lang').create();

		componentMock.clearNotifications();

		assert.equal(componentMock.alertNotifications.length, 0, 'should have no alert');

		componentMock.createAlert({
			message: 'hello',
			nativeDomain: 'wikia.com'
		});
		assert.equal(componentMock.alertNotifications.length, 1, 'should have 1 alert');
		assert.equal(componentMock.alertNotifications[0].message, 'hello', 'should be the created alert');
	});
});
