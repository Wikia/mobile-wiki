import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

const trackModule = require('common/utils/track');
let trackStub;

moduleForComponent('infobox-builder-edit-item-row', 'Integration | Component | infobox builder edit item row', {
	integration: true,

	beforeEach() {
		trackStub = sinon.stub(trackModule, 'track');
	},

	afterEach() {
		trackStub.restore();
	}
});

test('should focus on infoboxRowLabel input', function (assert) {
	const inputSelector = 'input[name=\'infoboxRowLabel\']';
	let input;

	this.render(hbs`{{infobox-builder-edit-item-row}}`);

	input = this.$(inputSelector);

	assert.equal(input.get(0), document.activeElement);
});

test('triggers exitMode action handler on enter key up', function (assert) {
	const actionHandler = sinon.spy(),
		inputSelector = 'input[name=\'infoboxRowLabel\']',
		enterKeyCode = 13;

	this.set('actionHandler', actionHandler);
	this.set('editRowItem', sinon.spy());

	this.render(hbs`{{infobox-builder-edit-item-row exitEditMode=actionHandler editRowItem=editRowItem}}`);
	this.$(inputSelector).trigger(
		Ember.$.Event('keyup', {
			keyCode: enterKeyCode
		})
	);

	assert.equal(actionHandler.called, true);
});
