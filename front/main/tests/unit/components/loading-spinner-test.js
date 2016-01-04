import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('loading-spinner', 'Unit | Component | loading spinner', {
	unit: true
});

test('should be hidden by default', function (assert) {
	var componentMock = this.subject();

	assert.equal(componentMock.get('isVisible'), false);
});

test('should be visible if loading param is truthy', function (assert) {
	var componentMock = this.subject({
		active: true
	});

	assert.equal(componentMock.get('isVisible'), true);
});

test('should be hidden if loading param is falsy', function (assert) {
	var componentMock = this.subject({
		active: false
	});

	assert.equal(componentMock.get('isVisible'), false);
});
