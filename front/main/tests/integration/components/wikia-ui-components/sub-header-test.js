import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const fixedClass = 'fixed',
	negativeIndex = -1,
	title = 'Test Header',
	buttonLabel = 'Save',
	backArrowTooltip = 'lorem ipsum dolor';

moduleForComponent('wikia-ui-components/sub-header', 'Unit | Component | sub header', {
	integration: true,
	beforeEach: function () {
		this.set('onBackArrowClick', sinon.spy());
		this.set('onConfirmBtnClick', sinon.spy());
	}
});

test('should have given title', function (assert) {
	this.set('titleText', title);
	this.render(hbs`{{wikia-ui-components/sub-header title=titleText onBackArrowClick=onBackArrowClick onConfirmBtnClick=onConfirmBtnClick}}`);

	assert.equal(this.$('header div').text(), title);
});

test('should have given button label', function (assert) {
	this.set('labelText', buttonLabel);
	this.render(hbs`{{wikia-ui-components/sub-header confirmBtnLabel=labelText onBackArrowClick=onBackArrowClick onConfirmBtnClick=onConfirmBtnClick}}`);

	assert.equal(this.$('header button').text(), buttonLabel);
});

test('should have given back arrow tooltip', function (assert) {
	this.set('backArrowTooltipText', backArrowTooltip);
	this.render(hbs`{{wikia-ui-components/sub-header backArrowTooltip=backArrowTooltipText onBackArrowClick=onBackArrowClick onConfirmBtnClick=onConfirmBtnClick}}`);

	assert.equal(this.$('a').attr('title'), backArrowTooltip);
});

test('should not be fixed', function (assert) {
	this.render(hbs`{{wikia-ui-components/sub-header onBackArrowClick=onBackArrowClick onConfirmBtnClick=onConfirmBtnClick}}`);

	assert.equal(this.$('header').attr('class').indexOf(fixedClass), negativeIndex);
});

test('should be fixed', function (assert) {
	this.set('fixedState', true);
	this.render(hbs`{{wikia-ui-components/sub-header fixed=fixedState onBackArrowClick=onBackArrowClick onConfirmBtnClick=onConfirmBtnClick}}`);

	assert.notEqual(this.$('header').attr('class').indexOf(fixedClass), negativeIndex);
});

test('clicking on back arrow triggers onBackArrowClick handler', function (assert) {
	const onBackArrowClickSpy = this.get('onBackArrowClick');

	this.render(hbs`{{wikia-ui-components/sub-header onBackArrowClick=onBackArrowClick onConfirmBtnClick=onConfirmBtnClick}}`);
	this.$('a').click();

	assert.equal(onBackArrowClickSpy.called, true);
});

test('clicking on button triggers onConfirmBtnClick handler', function (assert) {
	const onConfirmBtnClickSpy = this.get('onConfirmBtnClick');

	this.render(hbs`{{wikia-ui-components/sub-header onBackArrowClick=onBackArrowClick onConfirmBtnClick=onConfirmBtnClick}}`);
	this.$('button').click();

	assert.equal(onConfirmBtnClickSpy.called, true);
});
