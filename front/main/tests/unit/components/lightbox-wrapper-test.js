import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('lightbox-wrapper', 'Unit | Component | lightbox wrapper', {
	unit: true
});

test('toggleFooter method toggles footerExpanded', function (assert) {
	const componentMock = this.subject();

	assert.equal(componentMock.get('footerExpanded'), false);

	componentMock.send('toggleFooter');
	assert.equal(componentMock.get('footerExpanded'), true);

	componentMock.send('toggleFooter');
	assert.equal(componentMock.get('footerExpanded'), false);
});

test('toggleUI method toggles footerHidden and headerHidden', function (assert) {
	const componentMock = this.subject();

	assert.equal(componentMock.get('footerHidden'), false);
	assert.equal(componentMock.get('headerHidden'), false);

	componentMock.send('toggleUI');
	assert.equal(componentMock.get('footerHidden'), true);
	assert.equal(componentMock.get('headerHidden'), true);

	componentMock.send('toggleUI');
	assert.equal(componentMock.get('footerHidden'), false);
	assert.equal(componentMock.get('headerHidden'), false);
});
