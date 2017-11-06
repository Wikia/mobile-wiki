define('mobile-wiki/tests/integration/components/wikia-ui-components/sub-header-test', ['sinon', 'ember-qunit'], function (_sinon, _emberQunit) {
	'use strict';

	var fixedClass = 'sub-head--fixed',
	    negativeIndex = -1,
	    title = 'Test Header',
	    buttonLabel = 'Save',
	    backArrowTooltip = 'lorem ipsum dolor',
	    componentSelector = 'header.sub-head',
	    backArrorSelector = 'a.sub-head--cancel',
	    buttonSelector = 'button.sub-head--done',
	    titleSelector = 'h2.sub-head--title';

	(0, _emberQunit.moduleForComponent)('wikia-ui-components/sub-header', 'Integration | Component | sub header', {
		integration: true,
		beforeEach: function beforeEach() {
			this.set('onBack', _sinon.default.spy());
			this.set('onTitleClick', _sinon.default.spy());
			this.set('onConfirm', _sinon.default.spy());
		}
	});

	(0, _emberQunit.test)('should have given title', function (assert) {
		this.set('titleText', title);
		this.render(Ember.HTMLBars.template({
			"id": "ZPskpC43",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/sub-header\",null,[[\"title\",\"onBack\",\"onConfirm\",\"onTitleClick\"],[[19,0,[\"titleText\"]],[19,0,[\"onBack\"]],[19,0,[\"onConfirm\"]],[19,0,[\"onTitleClick\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$(titleSelector).text(), title);
	});

	(0, _emberQunit.test)('should have given button label', function (assert) {
		this.set('labelText', buttonLabel);
		this.render(Ember.HTMLBars.template({
			"id": "4T/+5mUO",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/sub-header\",null,[[\"confirmLabel\",\"onBack\",\"onConfirm\",\"onTitleClick\"],[[19,0,[\"labelText\"]],[19,0,[\"onBack\"]],[19,0,[\"onConfirm\"]],[19,0,[\"onTitleClick\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$(buttonSelector).text(), buttonLabel);
	});

	(0, _emberQunit.test)('should have given back arrow tooltip', function (assert) {
		this.set('backArrowTooltipText', backArrowTooltip);
		this.render(Ember.HTMLBars.template({
			"id": "bUUC9Dak",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/sub-header\",null,[[\"backArrowTooltip\",\"onBack\",\"onConfirm\",\"onTitleClick\"],[[19,0,[\"backArrowTooltipText\"]],[19,0,[\"onBack\"]],[19,0,[\"onConfirm\"]],[19,0,[\"onTitleClick\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$(backArrorSelector).attr('title'), backArrowTooltip);
	});

	(0, _emberQunit.test)('should not be fixed', function (assert) {
		this.render(Ember.HTMLBars.template({
			"id": "PjXR1WzV",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/sub-header\",null,[[\"onBack\",\"onConfirm\",\"onTitleClick\"],[[19,0,[\"onBack\"]],[19,0,[\"onConfirm\"]],[19,0,[\"onTitleClick\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$(componentSelector).attr('class').indexOf(fixedClass), negativeIndex);
	});

	(0, _emberQunit.test)('should be fixed', function (assert) {
		this.set('fixedState', true);
		this.render(Ember.HTMLBars.template({
			"id": "UoGYdKRE",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/sub-header\",null,[[\"fixed\",\"onBack\",\"onConfirm\",\"onTitleClick\"],[[19,0,[\"fixedState\"]],[19,0,[\"onBack\"]],[19,0,[\"onConfirm\"]],[19,0,[\"onTitleClick\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.notEqual(this.$(componentSelector).attr('class').indexOf(fixedClass), negativeIndex);
	});

	(0, _emberQunit.test)('clicking on back arrow triggers onBack handler', function (assert) {
		var onBackSpy = this.get('onBack');

		this.render(Ember.HTMLBars.template({
			"id": "PjXR1WzV",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/sub-header\",null,[[\"onBack\",\"onConfirm\",\"onTitleClick\"],[[19,0,[\"onBack\"]],[19,0,[\"onConfirm\"]],[19,0,[\"onTitleClick\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));
		this.$(backArrorSelector).click();

		assert.equal(onBackSpy.called, true);
	});

	(0, _emberQunit.test)('clicking on button triggers onConfirm handler', function (assert) {
		var onConfirmSpy = this.get('onConfirm');

		this.render(Ember.HTMLBars.template({
			"id": "PjXR1WzV",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/sub-header\",null,[[\"onBack\",\"onConfirm\",\"onTitleClick\"],[[19,0,[\"onBack\"]],[19,0,[\"onConfirm\"]],[19,0,[\"onTitleClick\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));
		this.$(buttonSelector).click();

		assert.equal(onConfirmSpy.called, true);
	});

	(0, _emberQunit.test)('clicking on text triggers onTitleClick handler', function (assert) {
		var onTitleClickSpy = this.get('onTitleClick');

		this.render(Ember.HTMLBars.template({
			"id": "PjXR1WzV",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/sub-header\",null,[[\"onBack\",\"onConfirm\",\"onTitleClick\"],[[19,0,[\"onBack\"]],[19,0,[\"onConfirm\"]],[19,0,[\"onTitleClick\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));
		this.$(titleSelector).click();

		assert.equal(onTitleClickSpy.called, true);
	});

	(0, _emberQunit.test)('should render action buttons', function (assert) {
		this.render(Ember.HTMLBars.template({
			"id": "PjXR1WzV",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/sub-header\",null,[[\"onBack\",\"onConfirm\",\"onTitleClick\"],[[19,0,[\"onBack\"]],[19,0,[\"onConfirm\"]],[19,0,[\"onTitleClick\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.notEqual(this.$(backArrorSelector).length, 0);
		assert.notEqual(this.$(buttonSelector).length, 0);
	});

	(0, _emberQunit.test)('should not render action buttons', function (assert) {
		this.set('textOnly', true);
		this.render(Ember.HTMLBars.template({
			"id": "P/u1vcXD",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-ui-components/sub-header\",null,[[\"textOnly\",\"onBack\",\"onConfirm\",\"onTitleClick\"],[[19,0,[\"textOnly\"]],[19,0,[\"onBack\"]],[19,0,[\"onConfirm\"]],[19,0,[\"onTitleClick\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$(backArrorSelector).length, 0);
		assert.equal(this.$(buttonSelector).length, 0);
	});
});