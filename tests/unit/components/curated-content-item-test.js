import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Component | curated content item', (hooks) => {
	setupTest(hooks);

	test('returns correct icon name', function (assert) {
		const componentMock = this.owner.factoryFor('component:curated-content-item').create();

		assert.expect(7);

		componentMock.set('type', 'category');
		assert.equal(componentMock.get('icon'), 'wds-icons-grid');

		componentMock.set('type', 'section');
		assert.equal(componentMock.get('icon'), 'wds-icons-grid');

		componentMock.set('type', 'video');
		assert.equal(componentMock.get('icon'), 'wds-icons-play');

		componentMock.set('type', 'image');
		assert.equal(componentMock.get('icon'), 'wds-icons-image');

		componentMock.set('type', 'blog');
		assert.equal(componentMock.get('icon'), 'wds-icons-clock');

		componentMock.set('type', 'article');
		assert.equal(componentMock.get('icon'), 'wds-icons-article');

		componentMock.set('type', 'whatever');
		assert.equal(componentMock.get('icon'), 'wds-icons-article');
	});
});
