import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const icon = 'test-icon',
	tagName = 'a',
	defaultClassName = 'icon-button',
	defaultSVGClassName = 'icon-button-icon',
	svgSlector = 'svg',
	svgUseSelector = `${svgSlector} use`,
	defaultSize = 16,
	role = 'img',
	negativeIndex = -1;

moduleForComponent('wikia-ui-components/icon-button', 'Integration | Component | icon button', {
	integration: true,

	beforeEach() {
		this.set('icon', icon);
		this.set('action', sinon.spy());
	}
});

test('render default icon button', function (assert) {
	this.render(hbs`{{wikia-ui-components/icon-button icon=icon click=action}}`);

	assert.equal(this.$(tagName).attr('class').indexOf(defaultClassName) !== negativeIndex, true);
	assert.equal(this.$(svgSlector).attr('width'), defaultSize);
	assert.equal(this.$(svgSlector).attr('height'), defaultSize);
	assert.equal(this.$(svgSlector).attr('class').indexOf(defaultSVGClassName) !== negativeIndex, true);
	assert.equal(this.$(svgSlector).attr('role'), role);
	assert.equal(this.$(svgUseSelector).attr('xlink:href'), `#${icon}`);
});

test('render icon button with custom class', function (assert) {
	const customClass = 'custom-class';

	this.set('customClass', customClass);
	this.render(hbs`{{wikia-ui-components/icon-button icon=icon class=customClass click=action}}`);

	assert.equal(this.$(tagName).attr('class').indexOf(customClass) !== negativeIndex, true);
});

test('render icon button with custom iconSize', function (assert) {
	const iconSize = 24;

	this.set('iconSize', iconSize);
	this.render(hbs`{{wikia-ui-components/icon-button icon=icon iconSize=iconSize click=action}}`);

	assert.equal(this.$(svgSlector).attr('width'), iconSize);
	assert.equal(this.$(svgSlector).attr('height'), iconSize);
});

test('render icon button with browser link tooltip', function (assert) {
	const tooltip = 'lorem ipsum dolor';

	this.set('tooltip', tooltip);
	this.render(hbs`{{wikia-ui-components/icon-button icon=icon title=tooltip click=action}}`);

	assert.equal(this.$(tagName).attr('title'), tooltip);
});

test('clicking button triggers action', function (assert) {
	this.render(hbs`{{wikia-ui-components/icon-button icon=icon click=action}}`);
	this.$(tagName).click();

	assert.equal(this.get('action').called, true);
});
