import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('infobox-builder', 'Integration | Component | infobox builder', {
	integration: true
});

test('reset item in edit mode on clicking preview background', function (assert) {
	const setEditItemSpy = sinon.spy(),
		previewSelector = 'div.infobox-builder-preview';

	this.set('setEditItem', setEditItemSpy);
	this.render(hbs`{{infobox-builder setEditItem=setEditItem}}`);

	this.$(previewSelector).click();

	assert.equal(setEditItemSpy.called, true);
	assert.equal(setEditItemSpy.calledWith(null), true);
});

test('Go to source is rendered if not in VE context', function (assert) {
	const goToSourceSelector = '.infobox-builder-go-to-source-button';

	this.set('isVEContext', false);
	this.render(hbs`{{infobox-builder isGoToSourceEnabled=isVEContext}}`);

	assert.equal(this.$(goToSourceSelector).length, 1);
});

test('Go to source is not rendered if in VE context', function (assert) {
	const goToSourceSelector = '.infobox-builder-go-to-source-button';

	this.set('isVEContext', true);
	this.render(hbs`{{infobox-builder isGoToSourceEnabled=isVEContext}}`);

	assert.equal(this.$(goToSourceSelector).length, 0);
});
