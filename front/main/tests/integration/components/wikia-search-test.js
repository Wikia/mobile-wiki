import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const trackModule = require('common/utils/track');
let trackStub;

const wikiaSearchDivSelector = '.wikia-search',
	negativeIndex = -1,
	emptySearchClass = 'wikia-search--empty',
	focusedInputClass = 'wikia-search--focused',
	hasSuggestionsClass = 'wikia-search--has-suggestions';

moduleForComponent('wikia-search', 'Integration | Component | wikia search', {
	integration: true,

	beforeEach() {
		trackStub = sinon.stub(trackModule, 'track');
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
		negativeIndex,
		`wikia-search has ${emptySearchClass} class`
	);
	assert.equal(
		wikiaSearchClass.indexOf(focusedInputClass),
		negativeIndex,
		`wikia-search doesn't have ${focusedInputClass} class`
	);
	assert.equal(
		wikiaSearchClass.indexOf(hasSuggestionsClass),
		negativeIndex,
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
		negativeIndex,
		`wikia-search has ${emptySearchClass} class`
	);
	assert.notEqual(
		wikiaSearchClass.indexOf(focusedInputClass),
		negativeIndex,
		`wikia-search has ${focusedInputClass} class`
	);
	assert.equal(
		wikiaSearchClass.indexOf(hasSuggestionsClass),
		negativeIndex,
		`wikia-search doesn't have ${hasSuggestionsClass} class`
	);
});

test('display div with loading search suggestions', function (assert) {
	this.render(hbs`{{wikia-search
		isLoadingResultsSuggestions=true
		suggestions=[]
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
