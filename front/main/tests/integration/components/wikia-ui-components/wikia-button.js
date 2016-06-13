import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const buttonSelector = 'wikia-button';

moduleForComponent('wikia-ui-components/wikia-button', 'Integration | Component | wikia button', {
	integration: true,

	beforeEach() {
		this.set('action', sinon.spy());
	}
});

test('clicking button triggers action', function (assert) {
	this.render(hbs`{{wikia-ui-components/wikia-button on=action}}`);
	this.$(buttonSelector).click();

	assert.equal(this.get('action').called, false);
});
