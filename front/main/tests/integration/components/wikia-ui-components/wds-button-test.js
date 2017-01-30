import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

const buttonSelector = '.wds-button';

moduleForComponent('wikia-ui-components/wds-button', 'Integration | Component | wikia button', {
	integration: true,

	beforeEach() {
		this.set('action', sinon.spy());
	}
});

test('clicking button triggers action', function (assert) {
	this.render(hbs`{{wikia-ui-components/wds-button onClick=action}}`);
	this.$(buttonSelector).click();

	assert.equal(this.get('action').called, true);
});
