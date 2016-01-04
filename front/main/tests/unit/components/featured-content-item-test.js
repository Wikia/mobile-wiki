import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('featured-content-item', 'Unit | Component | featured content item', {
	unit: true
});

test('computes container height properly', function (assert) {
	var componentMock = this.subject(),
		viewportWidth = 400,
		// 16:9 ratio
		containerHeight = 225;

	Ember.run(function () {
		componentMock.updateContainerHeight(viewportWidth);

		assert.equal(componentMock.get('style').toString(), 'height: ' + containerHeight + 'px;');
	});
});
