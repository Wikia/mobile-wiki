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

	this.render(hbs`{{discussion-categories categories=categories visibleCategoriesCount=10}}`);

	// 11 = 10 categories + All
	assert.equal(this.$('li').length, 11);
});


test('should display all categories after click "more categories"', function (assert) {
	this.set('categories', getCategories(20));

	this.render(hbs`{{discussion-categories categories=categories}}`);

	this.$('button').click();

	// 21 = 20 categories + All
	assert.equal(this.$('li:not(.hidden)').length, 21);
});

test('should select "All" by default', function (assert) {
	this.set('categories', getCategories(20));

	this.render(hbs`{{discussion-categories inputIdPrefix='test' categories=categories}}`);

	assert.ok(this.$('label[for="test-discussion-category-all"] span').hasClass('active-element-background-color'));
});

test('should deselect "All" after selecting other', function (assert) {
	this.set('categories', getCategories(20));

	this.render(hbs`{{discussion-categories isAllCategories=true inputIdPrefix='test' categories=categories}}`);

	this.$('label:last').click();

	assert.ok(this.$('label:last span').hasClass('active-element-background-color'));
	assert.notOk(this.$('label[for="test-discussion-category-all"] span').hasClass('active-element-background-color'));
});

test('should deselect category after selecting "All"', function (assert) {
	this.set('categories', getCategories(20));

	this.render(hbs`{{discussion-categories inputIdPrefix='test' categories=categories}}`);

	this.$('label:last').click();
	this.$('label[for="test-discussion-category-all"]').click();

	assert.notOk(this.$('label:last span').hasClass('active-element-background-color'));
	assert.ok(this.$('label[for="test-discussion-category-all"] span').hasClass('active-element-background-color'));
});

test('should "Reset" return initial categories state', function (assert) {
	this.set('categories', getCategories(20));

	this.render(hbs`{{discussion-categories inputIdPrefix='test' visibleCategoriesCount=10 categories=categories}}`);

	this.$('label:last').click();
	this.$('button').click();
	this.$('legend').click();

	// click reset
	this.$('.discussion-filter-header a').click();

	assert.ok(this.$('label[for="test-discussion-category-all"] span').hasClass('active-element-background-color'));
	// 11 = 10 categories + All
	assert.equal(this.$('li').length, 11);
	assert.notOk(this.$('.discussion-categories').hasClass('collapsed'));
});
