import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('collapsible-menu', 'Unit | Component | collapsible menu', {
	unit: true
});

test('Beginning state', function (assert) {
	const component = this.subject();

	assert.equal(component.isCollapsed, true, 'component should start collapsed');
});

test('Calling toggleMenu to expand and then collapse', function (assert) {
	const component = this.subject();

	assert.expect(2);

	component.send('toggleMenu');
	assert.equal(component.isCollapsed, false, 'component should then be expanded');

	component.send('toggleMenu');
	assert.equal(component.isCollapsed, true, 'it should flip back to collapsed');
});
