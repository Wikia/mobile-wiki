import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

const trackModule = require('common/utils/track');
let trackStub;

moduleForComponent('discussion-categories', 'Integration | Component | discussion categories component', {
	integration: true,

	beforeEach() {
		trackStub = sinon.stub(trackModule, 'track');
	},

	afterEach() {
		trackStub.restore();
	},
});

/**
 * Helper method for generating category list
 * @param {number} count
 * @returns {Array}
 */
function getCategories(count) {
	const categories = [];

	for (let i = 0; i < count; i++) {
		categories.pushObject({
			collapsed: false,
			description: `description ${i}`,
			displayOrder: i,
			id: i,
			name: `name${i}`,
			selected: false,
		});
	}

	return categories;
}

test('category list not collapsed by default', function (assert) {
	this.set('categories', getCategories(20));

	this.render(hbs`{{discussion-categories categories=categories}}`);

	assert.notOk(this.$('.discussion-categories').hasClass('collapsed'));
});


test('category list collapsed after click on header', function (assert) {
	this.set('categories', getCategories(20));

	this.render(hbs`{{discussion-categories categories=categories}}`);

	this.$('legend').click();

	assert.ok(this.$('.discussion-categories').hasClass('collapsed'));
});


test('should display up to 10 categories by default', function (assert) {
	this.set('categories', getCategories(20));

	this.render(hbs`{{discussion-categories categories=categories}}`);

	// 11 = 10 categories + All
	assert.equal(this.$('li').length, 11);
});
