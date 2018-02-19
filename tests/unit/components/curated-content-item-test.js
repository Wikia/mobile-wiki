import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('curated-content-item', 'Unit | Component | curated content item', {
	unit: true,
	needs: [
		'service:fastboot'
	]
});

test('returns correct icon name', function (assert) {
	const componentMock = this.subject();

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
