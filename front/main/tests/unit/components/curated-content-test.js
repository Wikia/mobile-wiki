import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('curated-content', 'Unit | Component | curated content', {
	unit: true,

	beforeEach: function () {
		require('common/utils/track').track = Ember.K;
	}
});

test('handles click on a section properly', function (assert) {
	var componentMock = this.subject(),
		sectionItem = {
			type: 'section'
		};

	Ember.run(function () {
		componentMock.trackClick = function (category, label) {
			assert.equal(category, 'modular-main-page');
			assert.equal(label, 'curated-content-item-section');
		};

		// This is the analogue to openCuratedContentItem='openCuratedContentItem' in the parent template
		componentMock.set('openCuratedContentItem', 'openCuratedContentItem');

		componentMock.set('targetObject', {
			openCuratedContentItem: function (item) {
				assert.equal(item, sectionItem);
			}
		});
		componentMock.send('clickItem', sectionItem);
	});
});

test('handles click on a category properly', function (assert) {
	var componentMock = this.subject(),
		categoryItem = {
			type: 'category'
		};

	Ember.run(function () {
		componentMock.trackClick = function (category, label) {
			assert.equal(category, 'modular-main-page');
			assert.equal(label, 'curated-content-item-category');
		};

		// This is the analogue to openCuratedContentItem='openCuratedContentItem' in the parent template
		componentMock.set('openCuratedContentItem', 'openCuratedContentItem');

		componentMock.set('targetObject', {
			openCuratedContentItem: function (item) {
				assert.equal(item, categoryItem)
			}
		});

		componentMock.send('clickItem', categoryItem);
	});
});

test('handles click on an article properly', function (assert) {
	var componentMock = this.subject(),
		articleItem = {
			type: 'article'
		};

	Ember.run(function () {
		componentMock.trackClick = function (category, label) {
			assert.equal(category, 'modular-main-page');
			assert.equal(label, 'curated-content-item-article');
		};

		componentMock.send('clickItem', articleItem);
	});
});

test('handles click on an item without a type properly', function (assert) {
	var componentMock = this.subject(),
		otherItem = {
			label: 'whatever'
		};

	Ember.run(function () {
		componentMock.trackClick = function (category, label) {
			assert.equal(category, 'modular-main-page');
			assert.equal(label, 'curated-content-item-other');
		};

		componentMock.send('clickItem', otherItem);
	});
});
