import {find, findAll, render} from '@ember/test-helpers';
import Service from '@ember/service';
import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import require from 'require';
import {module, test} from 'qunit';
import {setupRenderingTest} from 'ember-qunit';

const trackModule = require('mobile-wiki/utils/track');
let trackStub;

const wikiaSearchDivSelector = '.wikia-search',
	focusedInputClass = 'wikia-search--focused',
	hasSuggestionsClass = 'wikia-search--has-suggestions';

const i18nStub = Service.extend({
	t(key) {
		return key;
	}
});

module('Integration | Component | wikia search', (hooks) => {
	setupRenderingTest(hooks);

	hooks.beforeEach(function () {
		trackStub = sinon.stub(trackModule, 'track');
		this.owner.register('service:i18n', i18nStub);
		this.i18nService = this.owner.lookup('service:i18n');
	});

	hooks.afterEach(() => {
		trackStub.restore();
	});

	test('search displayed correctly with default settings', async (assert) => {
		await render(hbs`{{wikia-search}}`);

		const wikiaSearchClass = find(wikiaSearchDivSelector).className;

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

	test('search input has correct classes when inputFocused=true', async (assert) => {
		await render(hbs`
      {{wikia-search
          inputFocused=true
      }}`);

		const wikiaSearchClass = find(wikiaSearchDivSelector).className;

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

	test('display div with loading search suggestions', async (assert) => {
		await render(hbs`{{wikia-search
          isLoadingResultsSuggestions=true
      }}`);

		assert.equal(findAll('.wikia-search__loading').length, 1);
	});

	test('display div with loading search suggestions', async function (assert) {
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

		await render(hbs`{{wikia-search
          suggestions=suggestions
      }}`);
		this.set('suggestions', suggestions);

		assert.equal(findAll('.wikia-search__search-suggestion').length, suggestions.length);
	});
});
