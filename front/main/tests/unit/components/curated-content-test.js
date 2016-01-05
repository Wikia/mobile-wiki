import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

const track = require('common/utils/track').track;

moduleForComponent('curated-content', 'Unit | Component | curated content', {
	unit: true,

	beforeEach() {
		require('common/utils/track').track = Ember.K;
	},

	afterEach() {
		require('common/utils/track').track = track;
	}
});

test('handles click on a section properly', function (assert) {
	const sectionItem = {
		type: 'section'
	};

	Ember.run(() => {
		const componentMock = this.subject({
			openCuratedContentItem: 'openCuratedContentItem',
			targetObject: {
				openCuratedContentItem(item) {
					assert.equal(item, sectionItem);
				}
			},

			trackClick(category, label) {
				assert.equal(category, 'modular-main-page');
				assert.equal(label, 'curated-content-item-section');
			}
		});

		componentMock.send('clickItem', sectionItem);
	});
});

test('handles click on a category properly', function (assert) {
	const categoryItem = {
		type: 'category'
	};

	Ember.run(() => {
		const componentMock = this.subject({
			openCuratedContentItem: 'openCuratedContentItem',
			targetObject: {
				openCuratedContentItem(item) {
					assert.equal(item, categoryItem);
				}
			},

			trackClick(category, label) {
				assert.equal(category, 'modular-main-page');
				assert.equal(label, 'curated-content-item-category');
			}
		});

		componentMock.send('clickItem', categoryItem);
	});
});

test('handles click on an article properly', function (assert) {
	const articleItem = {
		type: 'article'
	};

	Ember.run(() => {
		const componentMock = this.subject({
			trackClick(category, label) {
				assert.equal(category, 'modular-main-page');
				assert.equal(label, 'curated-content-item-article');
			}
		});

		componentMock.send('clickItem', articleItem);
	});
});

test('handles click on an item without a type properly', function (assert) {
	const otherItem = {
		label: 'whatever'
	};

	Ember.run(() => {
		const componentMock = this.subject({
			trackClick(category, label) {
				assert.equal(category, 'modular-main-page');
				assert.equal(label, 'curated-content-item-other');
			}
		});

		componentMock.send('clickItem', otherItem);
	});
});
