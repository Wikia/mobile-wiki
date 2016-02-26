import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('wikia-ui-components/on-hover-tooltip', 'Unit | Component | on hover tooltip', {
	unit: true
});

test('creates proper styles computed property', function (assert) {
	const componentMock = this.subject(),
		posX = 10,
		posY = 20,
		styles = `left: ${posX}px; top: ${posY}px;`;

	componentMock.set('posX', posX);
	componentMock.set('posY', posY);

	assert.equal(componentMock.get('style'), styles);
});
