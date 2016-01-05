import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('image-media', 'Unit | Component | image media', {
	unit: true
});

test('computedHeight article image 200x1000', function (assert) {
	const height = 1000;

	Ember.run(() => {
		const component = this.subject({
			height,
			width: 200
		});

		component.set('articleContent', {
			width: 400
		});
		assert.equal(component.get('computedHeight'), height);
	});
});

test('computedHeight article image 1000x200', function (assert) {
	const expected = 80;

	Ember.run(() => {
		const component = this.subject({
			height: 200,
			width: 1000
		});

		component.set('articleContent', {
			width: 400
		});
		assert.equal(component.get('computedHeight'), expected);
	});
});

test('computedHeight update when height changes', function (assert) {
	Ember.run(() => {
		const component = this.subject({
			height: 200,
			width: 1000,
			articleContent: {
				width: 400
			}
		});

		component.set('height', {
			width: 300
		});
		assert.notEqual(component.get('computedHeight'), 0);
	});
});

