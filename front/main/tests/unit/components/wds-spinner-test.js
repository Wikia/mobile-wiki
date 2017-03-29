import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('wds-spinner', 'Unit | Component | loading spinner', {
	unit: true
});

test('should be hidden by default', function (assert) {
	Ember.run(() => {
		const componentMock = this.subject();

		assert.equal(componentMock.get('isVisible'), false);
	});
});

test('should be visible if loading param is truthy', function (assert) {
	Ember.run(() => {
		const componentMock = this.subject();

		componentMock.set('active', true);
		assert.equal(componentMock.get('isVisible'), true);
	});
});

test('should be hidden if loading param is falsy', function (assert) {
	Ember.run(() => {
		const componentMock = this.subject();

		componentMock.set('active', false);
		assert.equal(componentMock.get('isVisible'), false);
	});
});
