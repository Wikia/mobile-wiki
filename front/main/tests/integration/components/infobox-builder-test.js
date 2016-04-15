import Ember from 'ember';
import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';
import {track} from 'common/utils/track';

moduleForComponent('infobox-builder', 'Integration | Component | infobox builder', {
	integration: true,

	beforeEach() {
		require('common/utils/track').track = Ember.K;
	},

	afterEach() {
		require('common/utils/track').track = track;
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

