import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import require from 'require';
import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

const trackModule = require('mobile-wiki/utils/track');
let trackStub;

const wikiaSearchDivSelector = '.wikia-search',
	emptySearchClass = 'wikia-search--empty',
	focusedInputClass = 'wikia-search--focused',
	hasSuggestionsClass = 'wikia-search--has-suggestions';

const i18nStub = Ember.Service.extend({
	t(key) {
		return key;
	}
});

moduleForComponent('wikia-search', 'Integration | Component | wikia search', {
	integration: true,

	beforeEach() {
		trackStub = sinon.stub(trackModule, 'track');
		this.register('service:i18n', i18nStub);
		this.inject.service('i18n', {as: 'i18nService'});
	},

	afterEach() {
		trackStub.restore();
	}
});

test('search displayed correctly with default settings', function (assert) {
	this.render(hbs`{{wikia-search}}`);

	const wikiaSearchClass = this.$(wikiaSearchDivSelector).attr('class');

	assert.notEqual(
		wikiaSearchClass.indexOf(emptySearchClass),
		-1,
		`wikia-search has ${emptySearchClass} class`
	);
	assert.equal(
		wikiaSearchClass.indexOf(focusedInputClass),
		-1,
		`wikia-search doesn't have ${focusedInputClass} class`
	);
	assert.equal(
		wikiaSearchClass.indexOf(hasSuggestionsClass),
		-1,
		`wikia-search doesn't have ${hasSuggestionsClass} class`
	);
});

test('search input has correct classes when inputFocused=true', function (assert) {
	this.render(hbs`
	{{wikia-search
		inputFocused=true
	}}`);

	const wikiaSearchClass = this.$(wikiaSearchDivSelector).attr('class');

	assert.notEqual(
		wikiaSearchClass.indexOf(emptySearchClass),
		-1,
		`wikia-search has ${emptySearchClass} class`
	);
	assert.notEqual(
		wikiaSearchClass.indexOf(focusedInputClass),
		-1,
		`wikia-search has ${focusedInputClass} class`
	);
	assert.equal(
		wikiaSearchClass.indexOf(hasSuggestionsClass),
		-1,
		`wikia-search doesn't have ${hasSuggestionsClass} class`
	);
});

test('display div with loading search suggestions', function (assert) {
	this.render(hbs`{{wikia-search
		isLoadingResultsSuggestions=true
	}}`);

	assert.equal(this.$('.wikia-search__loading').length, 1);
});

test('display div with loading search suggestions', function (assert) {
	const suggestions = [
		{
			uri: 'test1',
			text: 'test1'
		},
		{
			uri: 'test2',
			text: 'test2'
		},
		{
			uri: 'test3',
			text: 'test3'
		},
		{
			uri: 'test4',
			text: 'test4'
		}
	];

	this.set('suggestions', suggestions);
	this.render(hbs`
		{{wikia-search
			suggestions=suggestions
		}}`
	);

	assert.equal(this.$('.wikia-search__search-suggestion').length, suggestions.length);
});
