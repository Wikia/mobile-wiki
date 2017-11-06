define('mobile-wiki/tests/integration/components/wikia-ui-components/wds-button-test', ['sinon', 'ember-qunit'], function (_sinon, _emberQunit) {
	'use strict';

	var buttonSelector = '.wds-button';

	(0, _emberQunit.moduleForComponent)('wikia-ui-components/wds-button', 'Integration | Component | wikia button', {
		integration: true,

		beforeEach: function beforeEach() {
			this.set('action', _sinon.default.spy());
		}
	});

	(0, _emberQunit.test)('clicking button triggers action', function (assert) {
		this.render(Ember.HTMLBars.template({
			"id": "o+9bixUe",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/wds-button\",null,[[\"onClick\"],[[19,0,[\"action\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));
		this.$(buttonSelector).click();

		assert.equal(this.get('action').called, true);
	});
});