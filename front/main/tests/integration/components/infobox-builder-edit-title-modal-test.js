import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('infobox-builder-edit-title-modal', 'Integration | Component | infobox builder edit title modal', {
	integration: true
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
