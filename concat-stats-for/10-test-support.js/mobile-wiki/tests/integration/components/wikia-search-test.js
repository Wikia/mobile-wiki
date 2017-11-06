define('mobile-wiki/tests/integration/components/wikia-search-test', ['sinon', 'require', 'ember-qunit'], function (_sinon, _require2, _emberQunit) {
	'use strict';

	var trackModule = (0, _require2.default)('mobile-wiki/utils/track');
	var trackStub = void 0;

	var wikiaSearchDivSelector = '.wikia-search',
	    emptySearchClass = 'wikia-search--empty',
	    focusedInputClass = 'wikia-search--focused',
	    hasSuggestionsClass = 'wikia-search--has-suggestions';

	var i18nStub = Ember.Service.extend({
		t: function t(key) {
			return key;
		}
	});

	(0, _emberQunit.moduleForComponent)('wikia-search', 'Integration | Component | wikia search', {
		integration: true,

		beforeEach: function beforeEach() {
			trackStub = _sinon.default.stub(trackModule, 'track');
			this.register('service:i18n', i18nStub);
			this.inject.service('i18n', { as: 'i18nService' });
		},
		afterEach: function afterEach() {
			trackStub.restore();
		}
	});

	(0, _emberQunit.test)('search displayed correctly with default settings', function (assert) {
		this.render(Ember.HTMLBars.template({
			"id": "5w4ePCjp",
			"block": "{\"symbols\":[],\"statements\":[[1,[18,\"wikia-search\"],false]],\"hasEval\":false}",
			"meta": {}
		}));

		var wikiaSearchClass = this.$(wikiaSearchDivSelector).attr('class');

		assert.notEqual(wikiaSearchClass.indexOf(emptySearchClass), -1, 'wikia-search has ' + emptySearchClass + ' class');
		assert.equal(wikiaSearchClass.indexOf(focusedInputClass), -1, 'wikia-search doesn\'t have ' + focusedInputClass + ' class');
		assert.equal(wikiaSearchClass.indexOf(hasSuggestionsClass), -1, 'wikia-search doesn\'t have ' + hasSuggestionsClass + ' class');
	});

	(0, _emberQunit.test)('search input has correct classes when inputFocused=true', function (assert) {
		this.render(Ember.HTMLBars.template({
			"id": "slMr+3w6",
			"block": "{\"symbols\":[],\"statements\":[[0,\"\\n\\t\"],[1,[25,\"wikia-search\",null,[[\"inputFocused\"],[true]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		var wikiaSearchClass = this.$(wikiaSearchDivSelector).attr('class');

		assert.notEqual(wikiaSearchClass.indexOf(emptySearchClass), -1, 'wikia-search has ' + emptySearchClass + ' class');
		assert.notEqual(wikiaSearchClass.indexOf(focusedInputClass), -1, 'wikia-search has ' + focusedInputClass + ' class');
		assert.equal(wikiaSearchClass.indexOf(hasSuggestionsClass), -1, 'wikia-search doesn\'t have ' + hasSuggestionsClass + ' class');
	});

	(0, _emberQunit.test)('display div with loading search suggestions', function (assert) {
		this.render(Ember.HTMLBars.template({
			"id": "jtARTMlz",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-search\",null,[[\"isLoadingResultsSuggestions\"],[true]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$('.wikia-search__loading').length, 1);
	});

	(0, _emberQunit.test)('display div with loading search suggestions', function (assert) {
		var suggestions = [{
			uri: 'test1',
			text: 'test1'
		}, {
			uri: 'test2',
			text: 'test2'
		}, {
			uri: 'test3',
			text: 'test3'
		}, {
			uri: 'test4',
			text: 'test4'
		}];

		this.set('suggestions', suggestions);
		this.render(Ember.HTMLBars.template({
			"id": "xn7yzUjb",
			"block": "{\"symbols\":[],\"statements\":[[1,[25,\"wikia-search\",null,[[\"suggestions\"],[[19,0,[\"suggestions\"]]]]],false]],\"hasEval\":false}",
			"meta": {}
		}));

		assert.equal(this.$('.wikia-search__search-suggestion').length, suggestions.length);
	});
});