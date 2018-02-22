import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Component | collapsible menu', function (hooks) {
	setupTest(hooks);

	test('Beginning state', function (assert) {
		const component = this.owner.factoryFor('component:collapsible-menu').create();

		assert.equal(component.isCollapsed, true, 'component should start collapsed');
	});

	test('Calling toggleMenu to expand and then collapse', function (assert) {
		const component = this.owner.factoryFor('component:collapsible-menu').create();

		assert.expect(2);

		component.send('toggleMenu');
		assert.equal(component.isCollapsed, false, 'component should then be expanded');

		component.send('toggleMenu');
		assert.equal(component.isCollapsed, true, 'it should flip back to collapsed');
	});
});
