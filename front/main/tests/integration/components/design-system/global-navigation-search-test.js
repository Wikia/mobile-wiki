import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const inputSelector = '.wds-global-navigation__search-input',
	closeButtonSelector = '.wds-global-navigation__search-close',
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
		{{design-system.global-navigation-search
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

test('placeholder changes', function (assert) {
	const activateSearch = Ember.K,
		deactivateSearch = Ember.K,
		i18nStub = sinon.stub(window.i18n, 't');

	i18nStub.returnsArg(0);

	this.set('model', model);

	this.on('activateSearch', activateSearch);
	this.on('deactivateSearch', deactivateSearch);

	this.render(hbs`
		{{design-system.global-navigation-search
			model=model
			activateSearch=(action 'activateSearch')
			deactivateSearch=(action 'deactivateSearch')
		}}
	`);

	assert.equal(
		this.$(inputSelector).attr('placeholder'),
		model['placeholder-inactive'].key,
		'input has inactive placeholder'
	);

	this.$(inputSelector).trigger('focusin');

	assert.equal(
		this.$(inputSelector).attr('placeholder'),
		model['placeholder-active'].key,
		'input has active placeholder'
	);

	this.$(closeButtonSelector).click();

	assert.equal(
		this.$(inputSelector).attr('placeholder'),
		model['placeholder-inactive'].key,
		'input has inactive placeholder'
	);

	i18nStub.restore();
});

test('clears input on close button', function (assert) {
	this.set('model', model);

	this.render(hbs`
		{{design-system.global-navigation-search
			model=model
		}}
	`);

	this.$(inputSelector).val('test');
	this.$(inputSelector).trigger('keyup');
	this.$(closeButtonSelector).trigger('click');

	assert.equal(this.$(inputSelector).val(), '', 'input value is cleared');
});
