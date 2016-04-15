import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const trackModule = require('common/utils/track');
let trackStub;

/**
 * Perpares empty functions for all actions required by tested component
 * @returns {Object}
 */
function prepareActionsMocks() {
	const removeItem = () => {},
		setEditItem = () => {};

	return {
		removeItem,
		setEditItem,
	};
}

moduleForComponent('infobox-builder', 'Integration | Component | infobox builder', {
	integration: true,

	beforeEach() {
		trackStub = sinon.stub(trackModule, 'track');
	},

	afterEach() {
		trackStub.restore();
	}
});

test('reset item in edit mode on clicking preview background', function (assert) {
	const previewSelector = 'div.infobox-builder-preview',
		setEditItemSpy = sinon.spy();

	this.setProperties({
		setEditItem: setEditItemSpy,
		removeItem: () => {}
	});

	this.render(hbs`{{infobox-builder setEditItem=(action setEditItem) removeItem=(action removeItem)}}`);

	this.$(previewSelector).click();

	assert.equal(setEditItemSpy.called, true);
	assert.equal(setEditItemSpy.calledWith(null), true);
});

test('Go to source is rendered if not in VE context', function (assert) {
	const goToSourceSelector = '.infobox-builder-go-to-source-button';

	this.setProperties(prepareActionsMocks());
	this.set('isVEContext', false);
	this.render(hbs`{{infobox-builder isVEContext=isVEContext removeItem=(action removeItem)
		setEditItem=(action setEditItem)}}`);

	assert.equal(this.$(goToSourceSelector).length, 1);
});

test('Go to source is not rendered if in VE context', function (assert) {
	const goToSourceSelector = '.infobox-builder-go-to-source-button';

	this.setProperties(prepareActionsMocks());
	this.set('isVEContext', true);
	this.render(hbs`{{infobox-builder isVEContext=isVEContext removeItem=(action removeItem)
		setEditItem=(action setEditItem)}}`);

	assert.equal(this.$(goToSourceSelector).length, 0);
});
