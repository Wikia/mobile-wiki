define('mobile-wiki/tests/unit/components/collapsible-menu-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('collapsible-menu', 'Unit | Component | collapsible menu', {
		unit: true
	});

	(0, _emberQunit.test)('Beginning state', function (assert) {
		var component = this.subject();

		assert.equal(component.isCollapsed, true, 'component should start collapsed');
	});

	(0, _emberQunit.test)('Calling toggleMenu to expand and then collapse', function (assert) {
		var component = this.subject();

		assert.expect(2);

		component.send('toggleMenu');
		assert.equal(component.isCollapsed, false, 'component should then be expanded');

		component.send('toggleMenu');
		assert.equal(component.isCollapsed, true, 'it should flip back to collapsed');
	});
});