import {find, render} from '@ember/test-helpers';
import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, module} from 'qunit';
import {setupRenderingTest} from 'ember-qunit';

const icon = 'test-icon',
	tagName = 'a',
	defaultClassName = 'icon-button',
	defaultSVGClassName = 'icon-button-icon',
	svgSlector = 'svg',
	svgUseSelector = `${svgSlector} use`,
	defaultSize = 16,
	role = 'img',
	negativeIndex = -1;

module('Integration | Component | icon button', (hooks) => {
	setupRenderingTest(hooks);

	hooks.beforeEach(function () {
		this.set('icon', icon);
		this.set('action', sinon.spy());
	});

	test('render default icon button', async function (assert) {
		await render(hbs`{{wikia-ui-components/icon-button icon=icon click=action}}`);

		assert.equal(find(tagName).className.indexOf(defaultClassName) !== negativeIndex, true);
		assert.equal(find(svgSlector).getAttribute('width'), defaultSize);
		assert.equal(find(svgSlector).getAttribute('height'), defaultSize);
		assert.equal(find(svgSlector).getAttribute('class').indexOf(defaultSVGClassName) !== negativeIndex, true);
		assert.equal(find(svgSlector).getAttribute('role'), role);
		assert.equal(find(svgUseSelector).getAttribute('xlink:href'), `#${icon}`);
	});

	test('render icon button with custom class', async function (assert) {
		const customClass = 'custom-class';

		this.set('customClass', customClass);
		await render(hbs`{{wikia-ui-components/icon-button icon=icon class=customClass click=action}}`);

		assert.equal(find(tagName).className.indexOf(customClass) !== negativeIndex, true);
	});

	test('render icon button with custom iconSize', async function (assert) {
		const iconSize = 24;

		this.set('iconSize', iconSize);
		await render(hbs`{{wikia-ui-components/icon-button icon=icon iconSize=iconSize click=action}}`);

		assert.equal(find(svgSlector).getAttribute('width'), iconSize);
		assert.equal(find(svgSlector).getAttribute('height'), iconSize);
	});

	test('render icon button with browser link tooltip', async function (assert) {
		const tooltip = 'lorem ipsum dolor';

		this.set('tooltip', tooltip);
		await render(hbs`{{wikia-ui-components/icon-button icon=icon title=tooltip click=action}}`);

		assert.equal(find(tagName).getAttribute('title'), tooltip);
	});

	test('clicking button triggers action', async function (assert) {
		await render(hbs`{{wikia-ui-components/icon-button icon=icon click=action}}`);
		find(tagName).click();

		assert.equal(this.get('action').called, true);
	});
});
