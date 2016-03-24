import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';
import {track} from 'common/utils/track';


moduleForComponent('infobox-builder-edit-title-modal', 'Integration | Component | infobox builder edit title modal', {
	integration: true,
	beforeEach() {
		require('common/utils/track').track = Ember.K;
	},
	afterEach() {
		require('common/utils/track').track = track;
	}
});

test('should focus on infoboxRowLabel input', function (assert) {
	const buttonSelector = 'button';
	let buttons;

	this.set('showCancelButton', true);

	this.render(hbs`{{infobox-builder-edit-title-modal
			title=title
			showCancelButton=showEditTitleModalCancelButton
			cancelButtonAction=(action 'hideEditTitleModal')
			cancelButtonText=(i18n 'main.edit-title-modal-cancel' ns='infobox-builder')
			confirmButtonAction=(action 'changeTemplateTitle')
			confirmButtonText=editTitleModalConfirmButtonLabel
		}}`);

	buttons = this.$(buttonSelector);

	assert.equal(buttons.length, 2);
});

test('should focus on edit template title input', function (assert) {
	const inputSelector = '#editTemplateTitle';

	this.set('cancelButtonAction', sinon.spy());
	this.set('confirmButtonAction', sinon.spy());

	this.render(hbs`{{infobox-builder-edit-title-modal
		cancelButtonAction=cancelButtonAction
		confirmButtonAction=confirmButtonAction
	}}`);

	assert.equal(this.$(inputSelector).get(0), document.activeElement);
});
