import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('design-system.global-navigation-search', 'Unit | Component | global-navigation-search', {
	unit: true
});

test('submit event', function (assert) {
	const component = this.subject(),
		onSuggestionEnterKey = sinon.stub(component, 'onSuggestionEnterKey'),
		setSearchSuggestionItems = sinon.stub(component, 'setSearchSuggestionItems');

	component.set('selectedSuggestionIndex', -1);
	component.trigger('submit');

	assert.notOk(onSuggestionEnterKey.called, 'do not trigger onSuggestionEnterKey when no suggestion is selected');
	assert.ok(setSearchSuggestionItems.calledOnce, 'clear suggestions when no suggestion selected');

	component.set('selectedSuggestionIndex', 1);
	component.trigger('submit');

	assert.ok(onSuggestionEnterKey.calledOnce, 'trigger onSuggestionEnterKey when suggestion is selected');
	assert.ok(setSearchSuggestionItems.calledTwice, 'clear suggestions when suggestion is selected');
});

test('focus search', function (assert) {
	const component = this.subject();

	component.set('searchIsActive', false);
	component.send('focusSearch');

	assert.equal(component.get('searchIsActive'), true, 'focus on search sets searchIsActive to true');
});

test('close search', function (assert) {
	const component = this.subject(),
		setSearchSuggestionItems = sinon.stub(component, 'setSearchSuggestionItems');

	component.set('searchIsActive', true);
	component.set('query', 'test');
	component.send('closeSearch');

	assert.equal(component.get('searchIsActive'), false, 'search close sets searchIsActive to false');
	assert.equal(component.get('query'), '', 'search close resets query');
	assert.ok(setSearchSuggestionItems.calledOnce, 'search close clears suggestions');
});

test('query changed', function (assert) {
	const component = this.subject(),
		updateSuggestions = sinon.stub(component, 'updateSuggestions');

	component.set('query', 'foo');
	component.send('queryChanged', 'bar');

	assert.equal(component.get('query'), 'bar', 'query is updated when input value changes');
	assert.ok(updateSuggestions.calledWith('bar'), 'suggestions are updated with new query');
});

test('key down', function (assert) {
	const component = this.subject();

	component.set('suggestions', []);
	component.set('selectedSuggestionIndex', -1);
	component.send('onKeyDown');

	assert.equal(component.get('selectedSuggestionIndex'), -1, 'key down with no suggestions');

	component.set('suggestions', [0]);
	component.set('selectedSuggestionIndex', -1);
	component.send('onKeyDown');

	assert.equal(component.get('selectedSuggestionIndex'), 0, 'key down with a suggestion');

	component.set('suggestions', [0]);
	component.set('selectedSuggestionIndex', 0);
	component.send('onKeyDown');

	assert.equal(component.get('selectedSuggestionIndex'), 0, 'key down on the last suggestion');

	component.set('suggestions', [0, 1]);
	component.set('selectedSuggestionIndex', 0);
	component.send('onKeyDown');

	assert.equal(component.get('selectedSuggestionIndex'), 1, 'key down with multiple suggestions');
});

test('key up', function (assert) {
	const component = this.subject();

	component.set('suggestions', []);
	component.set('selectedSuggestionIndex', -1);
	component.send('onKeyUp');

	assert.equal(component.get('selectedSuggestionIndex'), -1, 'key up with no suggestions');

	component.set('suggestions', [0]);
	component.set('selectedSuggestionIndex', -1);
	component.send('onKeyUp');

	assert.equal(component.get('selectedSuggestionIndex'), -1, 'key up with no suggestion selected yet');

	component.set('suggestions', [0]);
	component.set('selectedSuggestionIndex', 0);
	component.send('onKeyUp');

	assert.equal(component.get('selectedSuggestionIndex'), -1, 'key up on the first suggestion');

	component.set('suggestions', [0, 1]);
	component.set('selectedSuggestionIndex', 1);
	component.send('onKeyUp');

	assert.equal(component.get('selectedSuggestionIndex'), 0, 'key up with multiple suggestions');
});

test('suggestion click', function (assert) {
	const component = this.subject();

	component.set('query', 'foo');
	component.send('suggestionClick', {
		title: 'bar'
	});

	assert.equal(component.get('query'), 'bar', 'query is updated with suggestion value when suggestion is clicked');
});

test('updateSuggestions', function (assert) {
	const component = this.subject(),
		setSearchSuggestionItems = sinon.stub(component, 'setSearchSuggestionItems'),
		hasCachedResult = sinon.stub(component, 'hasCachedResult'),
		getCachedResult = sinon.stub(component, 'getCachedResult'),
		searchWithoutDebounce = sinon.stub(component, 'searchWithoutDebounce'),
		debounce = sinon.stub(Ember.run, 'debounce', (target, func) => {
			func.call(target);
		});

	component.set('suggestionsEnabled', false);
	component.updateSuggestions();

	assert.equal(component.updateSuggestions(), false, 'quit early if suggestions are disabled');

	component.set('suggestionsEnabled', true);
	component.set('suggestions', ['foo', 'bar']);
	component.set('selectedSuggestionIndex', 1);
	component.updateSuggestions('a');

	assert.deepEqual(component.get('suggestions'), [], 'reset suggestions on new query');
	assert.equal(component.get('selectedSuggestionIndex'), -1, 'reset selected suggestion on new query');

	component.set('isLoadingResultsSuggestions', true);
	component.updateSuggestions('a');

	assert.notOk(setSearchSuggestionItems.called, 'do not set suggestions if query is too short');
	assert.equal(component.get('isLoadingResultsSuggestions'), false, 'stop loading suggestions if query is too short');

	hasCachedResult.returns(true);
	getCachedResult.returns('cached result');
	component.updateSuggestions('abc');

	assert.ok(hasCachedResult.calledOnce, 'checks if result is cached');
	assert.ok(getCachedResult.calledOnce, 'gets the cached result');
	assert.ok(setSearchSuggestionItems.calledWith('cached result'), 'sets search suggestions from cache');

	hasCachedResult.returns(false);
	component.updateSuggestions('abc');

	assert.equal(component.get('isLoadingResultsSuggestions'), true, 'set isLoadingResultsSuggestions to true');
	assert.ok(
		debounce.calledWith(component, component.searchWithoutDebounce, component.get('debounceDuration')),
		'debounce search when new query is not in the cache'
	);

	debounce.restore();
});

test('getSearchSuggestionsUrl', function (assert) {
	const model = {
			suggestions: {
				'param-name': 'query',
				url: 'http://google.com/'
			}
		},
		queries = [
			'',
			'query',
			'something that\'s encodable'
		],
		component = this.subject(),
		addQueryParams = sinon.stub(require('main/utils/url'), 'addQueryParams');

	component.set('model', model);

	queries.forEach((query) => {
		component.getSearchSuggestionsUrl(query);
		assert.ok(
			addQueryParams.calledWith('http://google.com/', {
				query
			}),
		);
	});

	addQueryParams.restore();
});

test('only runs one request for a given query at a time', function (assert) {
	const query = 'query',
		component = this.subject();

	assert.ok(
		!component.requestInProgress(query),
		'request is not in progess with startedRequest hasn\'t been called'
	);

	component.startedRequest(query);
	assert.ok(
		component.requestInProgress(query),
		'request is in progess when startedRequest has been called'
	);

	component.endedRequest(query);
	assert.ok(
		!component.requestInProgress(query),
		'request is no longer in progress with endedRequest has been called'
	);
});

test('cacheResult with one result', function (assert) {
	const query = 'some query',
		suggestions = ['some title'],
		component = this.subject();

	component.cacheResult(query, suggestions);
	assert.ok(component.hasCachedResult(query), 'acknowledges that the result is cached');
	assert.equal(component.getCachedResult(query), suggestions, 'correct cached value');
});

test('eviction tests', function (assert) {
	const component = this.subject();

	component.set('cachedResultsLimit', 2);
	assert.ok(!component.needToEvict(), 'needToEvict returns false when cache isn\'t full');

	component.cacheResult('query1', []);
	component.cacheResult('query2', []);
	assert.ok(component.needToEvict(), 'needToEvict returns true when cache is full');

	component.evictCachedResult();
	assert.ok(
		!component.hasCachedResult('query1') && component.hasCachedResult('query2'),
		'evicts first in cached value, keeps others'
	);
});

test('setSearchSuggestionItems - set suggestions to be empty', function (assert) {
	const component = this.subject();

	component.set('isLoadingResultsSuggestions', true);
	component.set('suggestions', ['test']);

	component.setSearchSuggestionItems();

	assert.deepEqual(component.get('suggestions'), [], 'suggestions should be empty after');
	assert.equal(component.get('isLoadingResultsSuggestions'), false, 'isLoadingResultsSuggestions is falsy');
});

test('setSearchSuggestionItems - correctly set suggestions array', function (assert) {
	const component = this.subject(),
		suggestionsFromApi = [
			'suggestion1',
			'suggestion 2!',
			'sug GES %^&*^%&>?<tion>',
			'no query inside',
			'sug sug suggestions sug sug'
		],
		suggestionsAfterProcessing = [
			{
				text: '<strong>sug</strong>gestion1',
				title: 'suggestion1',
				uri: '/wiki/suggestion1'
			},
			{
				text: '<strong>sug</strong>gestion 2!',
				title: 'suggestion 2!',
				uri: '/wiki/suggestion_2!'
			},
			{
				text: '<strong>sug</strong> GES %^&*^%&>?<tion>',
				title: 'sug GES %^&*^%&>?<tion>',
				uri: '/wiki/sug_GES_%25%5E%26*%5E%25%26%3E%3F%3Ction%3E'
			},
			{
				text: 'no query inside',
				title: 'no query inside',
				uri: '/wiki/no_query_inside'
			},
			{
				text: '<strong>sug</strong> ' +
				'<strong>sug</strong> ' +
				'<strong>sug</strong>gestions ' +
				'<strong>sug</strong> ' +
				'<strong>sug</strong>',
				title: 'sug sug suggestions sug sug',
				uri: '/wiki/sug_sug_suggestions_sug_sug'
			}
		];

	component.set('query', 'sug');
	assert.deepEqual(component.get('suggestions'), [], 'suggestions should be empty at init');

	component.setSearchSuggestionItems(suggestionsFromApi);

	assert.deepEqual(component.get('suggestions'), suggestionsAfterProcessing);
});
