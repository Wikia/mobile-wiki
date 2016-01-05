import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('featured-content-item', 'Unit | Component | featured content item', {
	unit: true
});

test('computes container height properly', function (assert) {
	const viewportWidth = 400,
		// 16:9 ratio
		containerHeight = 225,
		componentMock = this.subject();

	componentMock.set('viewportDimensions.width', viewportWidth);
	componentMock.updateContainerHeight();
	assert.equal(componentMock.get('style').toString(), `height: ${containerHeight}px;`);
});
