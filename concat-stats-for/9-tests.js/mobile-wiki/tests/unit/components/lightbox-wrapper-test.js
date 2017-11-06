define('mobile-wiki/tests/unit/components/lightbox-wrapper-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('lightbox-wrapper', 'Unit | Component | lightbox wrapper', {
		unit: true
	});

	(0, _emberQunit.test)('toggleFooter method toggles footerExpanded', function (assert) {
		var componentMock = this.subject();

		assert.equal(componentMock.get('footerExpanded'), false);

		componentMock.send('toggleFooter');
		assert.equal(componentMock.get('footerExpanded'), true);

		componentMock.send('toggleFooter');
		assert.equal(componentMock.get('footerExpanded'), false);
	});

	(0, _emberQunit.test)('toggleUI method toggles footerHidden and headerHidden', function (assert) {
		var componentMock = this.subject();

		assert.equal(componentMock.get('footerHidden'), false);
		assert.equal(componentMock.get('headerHidden'), false);

		componentMock.send('toggleUI');
		assert.equal(componentMock.get('footerHidden'), true);
		assert.equal(componentMock.get('headerHidden'), true);

		componentMock.send('toggleUI');
		assert.equal(componentMock.get('footerHidden'), false);
		assert.equal(componentMock.get('headerHidden'), false);
	});
});