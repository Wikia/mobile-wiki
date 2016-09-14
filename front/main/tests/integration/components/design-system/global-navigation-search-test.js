import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const searchSelector = '.wds-global-navigation__search',
	labelSelector = '.wds-global-navigation__search-label',
	inputSelector = '.wds-global-navigation__search-input',
	closeButtonSelector = '.wds-global-navigation__search-close',
	submitButtonSelector = '.wds-global-navigation__search-submit',
	model = {
		type: 'search',
		results: {
			url: '/Special:Search?fulltext=Search',
			'param-name': 'query'
		},
		'placeholder-inactive': {
			type: 'translatable-text',
			key: 'global-navigation-search-placeholder-inactive'
		},
		'placeholder-active': {
			type: 'translatable-text',
			key: 'global-navigation-search-placeholder-in-wiki'
		},
		suggestions: {
			url: '/index.php?action=ajax&rs=getLinkSuggest&format=json',
			'param-name': 'query'
		}
	};

moduleForComponent('design-system.global-navigation-search', 'Integration | Component | global-navigation-search', {
	integration: true
});

test('sends actions up', function (assert) {
	const activateSearch = sinon.spy(),
		deactivateSearch = sinon.spy();

	this.set('model', model);

	this.on('activateSearch', activateSearch);
	this.on('deactivateSearch', deactivateSearch);

	this.render(hbs`
		{{design-system/global-navigation-search
			model=model
			activateSearch=(action 'activateSearch')
			deactivateSearch=(action 'deactivateSearch')
		}}
	`);

	this.$(inputSelector).trigger('focusin');
	assert.ok(activateSearch.calledOnce, 'activateSearch action sent');

	this.$(closeButtonSelector).click();
	assert.ok(deactivateSearch.calledOnce, 'deactivateSearch action sent');
});

test('clears input on close button', function (assert) {
	this.set('model', model);

	this.render(hbs`
		{{design-system/global-navigation-search
			model=model
		}}
	`);

	this.$(inputSelector).val('test');
	this.$(inputSelector).trigger('keyup');
	this.$(closeButtonSelector).trigger('click');

	// TODO this fails because Ember first runs the line below and only later the closeSearch action is triggered
	assert.equal(this.$(inputSelector).val(), '', 'input value is cleared');
});
