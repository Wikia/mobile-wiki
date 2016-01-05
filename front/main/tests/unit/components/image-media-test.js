import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('image-media', 'Unit | Component | image media', {
	unit: true
});

test('computedHeight article image 200x1000', function (assert) {
	const height = 1000,
		component = this.subject();

	component.setProperties({
		height,
		width: 200,
		articleContent: {
			width: 400
		}
	});

	assert.equal(component.get('computedHeight'), height);
});

test('computedHeight article image 1000x200', function (assert) {
	const component = this.subject();

	component.setProperties({
		height: 200,
		width: 1000,
		articleContent: {
			width: 400
		}
	});

	assert.equal(component.get('computedHeight'), 80);
});
