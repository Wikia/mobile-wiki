define('mobile-wiki/tests/integration/components/wikia-ui-components/icon-button-test', ['sinon', 'ember-qunit'], function (_sinon, _emberQunit) {
	'use strict';

	var icon = 'test-icon',
	    tagName = 'a',
	    defaultClassName = 'icon-button',
	    defaultSVGClassName = 'icon-button-icon',
	    svgSlector = 'svg',
	    svgUseSelector = svgSlector + ' use',
	    defaultSize = 16,
	    role = 'img',
	    negativeIndex = -1;

	(0, _emberQunit.moduleForComponent)('wikia-ui-components/icon-button', 'Integration | Component | icon button', {
		integration: true,

		beforeEach: function beforeEach() {
			this.set('icon', icon);
			this.set('action', _sinon.default.spy());
		}
	});

	(0, _emberQunit.test)('render default icon button', function (assert) {
		this.render(Ember.HTMLBars.template({
			"id": "TC7lv9dr",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/icon-button\",null,[[\"icon\",\"click\"],[[19,0,[\"icon\"]],[19,0,[\"action\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$(tagName).attr('class').indexOf(defaultClassName) !== negativeIndex, true);
		assert.equal(this.$(svgSlector).attr('width'), defaultSize);
		assert.equal(this.$(svgSlector).attr('height'), defaultSize);
		assert.equal(this.$(svgSlector).attr('class').indexOf(defaultSVGClassName) !== negativeIndex, true);
		assert.equal(this.$(svgSlector).attr('role'), role);
		assert.equal(this.$(svgUseSelector).attr('xlink:href'), '#' + icon);
	});

	(0, _emberQunit.test)('render icon button with custom class', function (assert) {
		var customClass = 'custom-class';

		this.set('customClass', customClass);
		this.render(Ember.HTMLBars.template({
			"id": "tfrZVCR7",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/icon-button\",null,[[\"icon\",\"class\",\"click\"],[[19,0,[\"icon\"]],[19,0,[\"customClass\"]],[19,0,[\"action\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$(tagName).attr('class').indexOf(customClass) !== negativeIndex, true);
	});

	(0, _emberQunit.test)('render icon button with custom iconSize', function (assert) {
		var iconSize = 24;

		this.set('iconSize', iconSize);
		this.render(Ember.HTMLBars.template({
			"id": "RfPD78Ka",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/icon-button\",null,[[\"icon\",\"iconSize\",\"click\"],[[19,0,[\"icon\"]],[19,0,[\"iconSize\"]],[19,0,[\"action\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$(svgSlector).attr('width'), iconSize);
		assert.equal(this.$(svgSlector).attr('height'), iconSize);
	});

	(0, _emberQunit.test)('render icon button with browser link tooltip', function (assert) {
		var tooltip = 'lorem ipsum dolor';

		this.set('tooltip', tooltip);
		this.render(Ember.HTMLBars.template({
			"id": "feGItp5G",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/icon-button\",null,[[\"icon\",\"title\",\"click\"],[[19,0,[\"icon\"]],[19,0,[\"tooltip\"]],[19,0,[\"action\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$(tagName).attr('title'), tooltip);
	});

	(0, _emberQunit.test)('clicking button triggers action', function (assert) {
		this.render(Ember.HTMLBars.template({
			"id": "TC7lv9dr",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/icon-button\",null,[[\"icon\",\"click\"],[[19,0,[\"icon\"]],[19,0,[\"action\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));
		this.$(tagName).click();

		assert.equal(this.get('action').called, true);
	});
});