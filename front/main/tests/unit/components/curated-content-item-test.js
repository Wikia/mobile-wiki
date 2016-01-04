import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('curated-content-item', 'Unit | Component | curated content item', {
	unit: true
});

test('returns correct icon name', function (assert) {
	var componentMock = this.subject();

	Ember.run(function () {
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

test('computes image style properly', function (assert) {
	var componentMock = this.subject(),
		viewportWidth = 400,
		// Viewport minus 20 and then by half
		imageSize = 190;

	Ember.run(function () {
		componentMock.updateImageSize(viewportWidth);

		assert.equal(componentMock.get('style').toString(), 'height: ' + imageSize + 'px; width: ' + imageSize + 'px;');
	});
});
