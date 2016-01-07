import Ember from 'ember';
import {test} from 'ember-qunit';
import {module} from 'qunit';
import FeaturedContentMixin from 'main/mixins/featured-content';

module('Unit | Mixin | featured content', () => {
	/**
	 * @returns {Object}
	 */
	function getFeaturedContentMixin() {
		const mixin = Ember.Object.extend(FeaturedContentMixin).create();

		// We don't want to test jQuery DOM manipulation here
		mixin.currentItemIndexObserver = Ember.K;

		return mixin;
	}

	test('detects if there are multiple items in the model', (assert) => {
		const mixin = getFeaturedContentMixin();

		mixin.set('model', [{
			title: 'Item 1'
		}]);
		assert.equal(mixin.get('hasMultipleItems'), false);

		mixin.set('model', [{
			title: 'Item 1'
		}, {
			title: 'Item 2'
		}]);
		assert.equal(mixin.get('hasMultipleItems'), true);
	});

	test('returns the current item', (assert) => {
		const mixin = getFeaturedContentMixin();

		mixin.set('model', [{
			title: 'Item 1'
		}, {
			title: 'Item 2'
		}]);

		mixin.set('currentItemIndex', 0);
		assert.deepEqual(mixin.get('currentItem'), {
			title: 'Item 1'
		});

		mixin.set('currentItemIndex', 1);
		assert.deepEqual(mixin.get('currentItem'), {
			title: 'Item 2'
		});
	});

	test('sets proper index in the prevItem function', (assert) => {
		const mixin = getFeaturedContentMixin();

		mixin.set('model', [{
			title: 'Item 1'
		}, {
			title: 'Item 2'
		}, {
			title: 'Item 3'
		}]);

		mixin.prevItem();
		assert.equal(mixin.get('currentItemIndex'), 2);

		mixin.prevItem();
		assert.equal(mixin.get('currentItemIndex'), 1);

		mixin.prevItem();
		assert.equal(mixin.get('currentItemIndex'), 0);
	});

	test('sets proper index in the nextItem function', (assert) => {
		const mixin = getFeaturedContentMixin();

		mixin.set('model', [{
			title: 'Item 1'
		}, {
			title: 'Item 2'
		}, {
			title: 'Item 3'
		}]);

		mixin.nextItem();
		assert.equal(mixin.get('currentItemIndex'), 1);

		mixin.nextItem();
		assert.equal(mixin.get('currentItemIndex'), 2);

		mixin.nextItem();
		assert.equal(mixin.get('currentItemIndex'), 0);
	});
});
