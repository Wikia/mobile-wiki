define('mobile-wiki/tests/unit/components/curated-content-item-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('curated-content-item', 'Unit | Component | curated content item', {
		unit: true,
		needs: ['service:fastboot']
	});

	(0, _emberQunit.test)('returns correct icon name', function (assert) {
		var componentMock = this.subject();

		assert.expect(7);

		componentMock.set('type', 'category');
		assert.equal(componentMock.get('icon'), 'namespace-category');

		componentMock.set('type', 'section');
		assert.equal(componentMock.get('icon'), 'namespace-category');

		componentMock.set('type', 'video');
		assert.equal(componentMock.get('icon'), 'namespace-video');

		componentMock.set('type', 'image');
		assert.equal(componentMock.get('icon'), 'namespace-image');

		componentMock.set('type', 'blog');
		assert.equal(componentMock.get('icon'), 'namespace-blog');

		componentMock.set('type', 'article');
		assert.equal(componentMock.get('icon'), 'namespace-article');

		componentMock.set('type', 'whatever');
		assert.equal(componentMock.get('icon'), 'namespace-article');
	});
});