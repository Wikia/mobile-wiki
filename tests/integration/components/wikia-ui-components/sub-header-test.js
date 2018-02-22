import {find, findAll} from '@ember/test-helpers';
import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {module, setupRenderingTest} from 'ember-qunit';
import {test} from 'qunit';

const fixedClass = 'sub-head--fixed',
	negativeIndex = -1,
	title = 'Test Header',
	buttonLabel = 'Save',
	backArrowTooltip = 'lorem ipsum dolor',
	componentSelector = 'header.sub-head',
	backArrorSelector = 'a.sub-head--cancel',
	buttonSelector = 'button.sub-head--done',
	titleSelector = 'h2.sub-head--title';

module('Integration | Component | sub header', (hooks) => {
	setupRenderingTest(hooks);

	hooks.beforeEach(function () {
		this.set('onBack', sinon.spy());
		this.set('onTitleClick', sinon.spy());
		this.set('onConfirm', sinon.spy());
	});

	test('should have given title', function (assert) {
		this.set('titleText', title);
		this.render(hbs`{{wikia-ui-components/sub-header title=titleText onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.equal(find(titleSelector).innerText, title);
	});

	test('should have given button label', function (assert) {
		this.set('labelText', buttonLabel);
		this.render(hbs`{{wikia-ui-components/sub-header confirmLabel=labelText onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.equal(find(buttonSelector).innerText, buttonLabel);
	});

	test('should have given back arrow tooltip', function (assert) {
		this.set('backArrowTooltipText', backArrowTooltip);
		this.render(hbs`{{wikia-ui-components/sub-header backArrowTooltip=backArrowTooltipText
	 onBack=onBack onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.equal(find(backArrorSelector).getAttribute('title'), backArrowTooltip);
	});

	test('should not be fixed', function (assert) {
		this.render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.equal(find(componentSelector).className.indexOf(fixedClass), negativeIndex);
	});

	test('should be fixed', function (assert) {
		this.set('fixedState', true);
		this.render(hbs`{{wikia-ui-components/sub-header fixed=fixedState onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.notEqual(find(componentSelector).className.indexOf(fixedClass), negativeIndex);
	});

	test('clicking on back arrow triggers onBack handler', function (assert) {
		const onBackSpy = this.get('onBack');

		this.render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);
		find(backArrorSelector).click();

		assert.equal(onBackSpy.called, true);
	});

	test('clicking on button triggers onConfirm handler', function (assert) {
		const onConfirmSpy = this.get('onConfirm');

		this.render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);
		find(buttonSelector).click();

		assert.equal(onConfirmSpy.called, true);
	});

	test('clicking on text triggers onTitleClick handler', function (assert) {
		const onTitleClickSpy = this.get('onTitleClick');

		this.render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);
		find(titleSelector).click();

		assert.equal(onTitleClickSpy.called, true);
	});

	test('should render action buttons', function (assert) {
		this.render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.notEqual(findAll(backArrorSelector).length, 0);
		assert.notEqual(findAll(buttonSelector).length, 0);
	});

	test('should not render action buttons', function (assert) {
		this.set('textOnly', true);
		this.render(hbs`{{wikia-ui-components/sub-header textOnly=textOnly onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

		assert.equal(findAll(backArrorSelector).length, 0);
		assert.equal(findAll(buttonSelector).length, 0);
	});
});
