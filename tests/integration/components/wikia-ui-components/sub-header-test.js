import {find, findAll, render} from '@ember/test-helpers';
import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {setupRenderingTest} from 'ember-qunit';
import {module, test} from 'qunit';

const fixedClass = 'sub-head--fixed',
	negativeIndex = -1,
	title = 'Test Header',
	buttonLabel = 'Save',
	backArrowTooltip = 'lorem ipsum dolor',
	componentSelector = 'header.sub-head',
	backArrowSelector = 'a.sub-head--cancel',
	buttonSelector = 'button.sub-head--done',
	titleSelector = 'h2.sub-head--title';

module('Integration | Component | sub header', (hooks) => {
	setupRenderingTest(hooks);

	hooks.beforeEach(function () {
		this.set('onBack', sinon.spy());
		this.set('onTitleClick', sinon.spy());
		this.set('onConfirm', sinon.spy());
	});

	test('should have given title', async function (assert) {
		this.set('titleText', title);
		await render(hbs`{{wikia-ui-components/sub-header title=titleText onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.equal(find(titleSelector).innerText, title);
	});

	test('should have given button label', async function (assert) {
		this.set('labelText', buttonLabel);
		await render(hbs`{{wikia-ui-components/sub-header confirmLabel=labelText onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.equal(find(buttonSelector).innerText, buttonLabel);
	});

	test('should have given back arrow tooltip', async function (assert) {
		this.set('backArrowTooltipText', backArrowTooltip);
		await render(hbs`{{wikia-ui-components/sub-header backArrowTooltip=backArrowTooltipText
	 onBack=onBack onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.equal(find(backArrowSelector).getAttribute('title'), backArrowTooltip);
	});

	test('should not be fixed', async (assert) => {
		await render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.equal(find(componentSelector).className.indexOf(fixedClass), negativeIndex);
	});

	test('should be fixed', async function (assert) {
		this.set('fixedState', true);
		await render(hbs`{{wikia-ui-components/sub-header fixed=fixedState onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.notEqual(find(componentSelector).className.indexOf(fixedClass), negativeIndex);
	});

	test('clicking on back arrow triggers onBack handler', async function (assert) {
		const onBackSpy = this.get('onBack');

		await render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);
		find(backArrowSelector).click();

		assert.equal(onBackSpy.called, true);
	});

	test('clicking on button triggers onConfirm handler', async function (assert) {
		const onConfirmSpy = this.get('onConfirm');

		await render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);
		find(buttonSelector).click();

		assert.equal(onConfirmSpy.called, true);
	});

	test('clicking on text triggers onTitleClick handler', async function (assert) {
		const onTitleClickSpy = this.get('onTitleClick');

		await render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);
		find(titleSelector).click();

		assert.equal(onTitleClickSpy.called, true);
	});

	test('should render action buttons', async (assert) => {
		await render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.notEqual(findAll(backArrowSelector).length, 0);
		assert.notEqual(findAll(buttonSelector).length, 0);
	});

	test('should not render action buttons', async function (assert) {
		this.set('textOnly', true);
		await render(hbs`{{wikia-ui-components/sub-header textOnly=textOnly onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.equal(findAll(backArrowSelector).length, 0);
		assert.equal(findAll(buttonSelector).length, 0);
	});
});
