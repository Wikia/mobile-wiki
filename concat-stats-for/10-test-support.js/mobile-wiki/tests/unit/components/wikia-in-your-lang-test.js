define('mobile-wiki/tests/unit/components/wikia-in-your-lang-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('wikia-in-your-lang', 'Unit | Component | wikia-in-your-lang', {
		unit: true,
		needs: ['service:wiki-variables']
	});

	(0, _emberQunit.test)('createAlert', function (assert) {
		var componentMock = this.subject();

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