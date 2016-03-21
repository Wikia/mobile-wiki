import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('infobox-builder-edit-item-row', 'Integration | Component | infobox builder edit item row', {
	integration: true
});

test('should focus on infoboxRowLabel input', function (assert) {
	const inputSelector = 'input[name=\'infoboxRowLabel\']';
	let input;

	this.render(hbs`{{infobox-builder-edit-item-row}}`);

	input = this.$(inputSelector);

	assert.equal(input.get(0), document.activeElement);
});
