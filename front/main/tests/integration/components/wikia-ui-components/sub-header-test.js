import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const fixedClass = 'sub-head--fixed',
	negativeIndex = -1,
	title = 'Test Header',
	buttonLabel = 'Save',
	backArrowTooltip = 'lorem ipsum dolor',
	componentSelector = 'header.sub-head',
	backArrorSelector = 'a.sub-head--cancel',
	buttonSelector = 'button.sub-head--done',
	titleSelector = 'h2.sub-head--title';

moduleForComponent('wikia-ui-components/sub-header', 'Integration | Component | sub header', {
	integration: true,
	beforeEach() {
		this.set('onBack', sinon.spy());
		this.set('onTitleClick', sinon.spy());
		this.set('onConfirm', sinon.spy());
	}
});

test('should have given title', function (assert) {
	this.set('titleText', title);
	this.render(hbs`{{wikia-ui-components/sub-header title=titleText onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

	assert.equal(this.$(titleSelector).text(), title);
});

test('should have given button label', function (assert) {
	this.set('labelText', buttonLabel);
	this.render(hbs`{{wikia-ui-components/sub-header confirmLabel=labelText onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

	assert.equal(this.$(buttonSelector).text(), buttonLabel);
});

test('should have given back arrow tooltip', function (assert) {
	this.set('backArrowTooltipText', backArrowTooltip);
	this.render(hbs`{{wikia-ui-components/sub-header backArrowTooltip=backArrowTooltipText
	 onBack=onBack onConfirm=onConfirm onTitleClick=onTitleClick}}`);

	assert.equal(this.$(backArrorSelector).attr('title'), backArrowTooltip);
});

test('should not be fixed', function (assert) {
	this.render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

	assert.equal(this.$(componentSelector).attr('class').indexOf(fixedClass), negativeIndex);
});

test('should be fixed', function (assert) {
	this.set('fixedState', true);
	this.render(hbs`{{wikia-ui-components/sub-header fixed=fixedState onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

	assert.notEqual(this.$(componentSelector).attr('class').indexOf(fixedClass), negativeIndex);
});

test('clicking on back arrow triggers onBack handler', function (assert) {
	const onBackSpy = this.get('onBack');

	this.render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);
	this.$(backArrorSelector).click();

	assert.equal(onBackSpy.called, true);
});

test('clicking on button triggers onConfirm handler', function (assert) {
	const onConfirmSpy = this.get('onConfirm');

	this.render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);
	this.$(buttonSelector).click();

	assert.equal(onConfirmSpy.called, true);
});

test('clicking on text triggers onTitleClick handler', function (assert) {
	const onTitleClickSpy = this.get('onTitleClick');

	this.render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);
	this.$(titleSelector).click();

	assert.equal(onTitleClickSpy.called, true);
});

test('should render action buttons', function (assert) {
	this.render(hbs`{{wikia-ui-components/sub-header onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

	assert.notEqual(this.$(backArrorSelector).length, 0);
	assert.notEqual(this.$(buttonSelector).length, 0);
});

test('should not render action buttons', function (assert) {
	this.set('textOnly', true);
	this.render(hbs`{{wikia-ui-components/sub-header textOnly=textOnly onBack=onBack
	 onConfirm=onConfirm onTitleClick=onTitleClick}}`);

	assert.equal(this.$(backArrorSelector).length, 0);
	assert.equal(this.$(buttonSelector).length, 0);
});
