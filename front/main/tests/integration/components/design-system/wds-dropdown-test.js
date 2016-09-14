import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const dropdownSelector = '.wds-dropdown',
	toggleSelector = '.wds-dropdown__toggle',
	contentSelector = '.wds-dropdown__content',
	toggleSvg = '<svg class="wds-icon wds-icon-tiny wds-dropdown__toggle-chevron">' +
		'<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#wds-icons-dropdown-tiny"></use>' +
		'</svg>';

moduleForComponent('design-system.wds-dropdown', 'Integration | Component | wds-dropdown', {
	integration: true,

	beforeEach() {
		this.set('action', sinon.spy());
	}
});

test('yields toggle and content', function (assert) {
	this.render(hbs`
		{{#design-system.wds-dropdown as |dropdown|}}
			{{#dropdown.toggle}}Toggle{{/dropdown.toggle}}
			{{#dropdown.content}}Content{{/dropdown.content}}
		{{/design-system.wds-dropdown}}
	`);

	assert.equal(this.$(toggleSelector).html().trim(), `Toggle\n${toggleSvg}`, 'Toggle is rendered');
	assert.equal(this.$(contentSelector).html().trim(), 'Content', 'Content is rendered');
});

test('handles additional attributes', function (assert) {
	this.render(hbs`
		{{#design-system.wds-dropdown  as |dropdown|}}
			{{#dropdown.toggle title="Title"}}Toggle{{/dropdown.toggle}}
			{{#dropdown.content dropdownRightAligned=true}}Content{{/dropdown.content}}
		{{/design-system.wds-dropdown}}
	`);

	assert.equal(this.$(toggleSelector).prop('title'), 'Title', 'Toggle has title attribute');
	assert.ok(this.$(contentSelector).hasClass('wds-is-right-aligned'), 'Content', 'Content is right aligned');
});

test('handles class names', function (assert) {
	this.render(hbs`
		{{#design-system.wds-dropdown class="test-dropdown" as |dropdown|}}
			{{#dropdown.toggle class="test-dropdown-toggle"}}Toggle{{/dropdown.toggle}}
			{{#dropdown.content class="test-dropdown-content"}}Content{{/dropdown.content}}
		{{/design-system.wds-dropdown}}
	`);

	assert.ok(this.$(dropdownSelector).is('.wds-dropdown, .test-dropdown'), 'Dropdown has correct classes');
	assert.ok(this.$(toggleSelector).is('.wds-dropdown-toggle, .test-dropdown-toggle'), 'Toggle has correct classes');
	assert.ok(this.$(contentSelector).is('.wds-dropdown-content, .test-dropdown-content'), 'Content has correct classes');

	assert.notOk(this.$(dropdownSelector).hasClass('wds-is-active'), 'Not active at first');
	this.$(toggleSelector).click();
	assert.ok(this.$(dropdownSelector).hasClass('wds-is-active'), 'Active after a click');
	this.$(toggleSelector).click();
	assert.notOk(this.$(dropdownSelector).hasClass('wds-is-active'), 'Not active after clicking again');
});
