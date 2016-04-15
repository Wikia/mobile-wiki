import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const trackModule = require('common/utils/track');
let trackStub;

moduleForComponent('infobox-builder-edit-title-modal', 'Integration | Component | infobox builder edit title modal', {
	integration: true,

	beforeEach() {
		trackStub = sinon.stub(trackModule, 'track');
	},

	afterEach() {
		trackStub.restore();
	}
});

test('when showCancelButton set to true display 2 buttons', function (assert) {
	const buttonSelector = 'button';
	let buttons;

	this.set('showCancelButton', true);
	this.set('cancelButtonAction', sinon.spy());
	this.set('confirmButtonAction', sinon.spy());

	this.render(hbs`{{infobox-builder-edit-title-modal
			showCancelButton=showCancelButton
			cancelButtonAction=cancelButtonAction
			confirmButtonAction=confirmButtonAction
		}}`);

	buttons = this.$(buttonSelector);

	assert.equal(buttons.length, 2);
});

test('when showCancelButton not set display 1 button', function (assert) {
	const buttonSelector = 'button';
	let buttons;

	this.set('cancelButtonAction', sinon.spy());
	this.set('confirmButtonAction', sinon.spy());

	this.render(hbs`{{infobox-builder-edit-title-modal
			showCancelButton=showCancelButton
			cancelButtonAction=cancelButtonAction
			confirmButtonAction=confirmButtonAction
		}}`);

	buttons = this.$(buttonSelector);

	assert.equal(buttons.length, 1);
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
