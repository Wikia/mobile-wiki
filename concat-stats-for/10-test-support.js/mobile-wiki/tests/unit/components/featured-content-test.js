define('mobile-wiki/tests/unit/components/featured-content-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('featured-content', 'Unit | Component | featured content', {
		unit: true
	});

	(0, _emberQunit.test)('detects if there are multiple items in the model', function (assert) {
		var component = this.subject();

		component.currentItemIndexObserver = function () {};

		component.set('model', [{
			title: 'Item 1'
		}]);
		assert.equal(component.get('hasMultipleItems'), false);

		component.set('model', [{
			title: 'Item 1'
		}, {
			title: 'Item 2'
		}]);
		assert.equal(component.get('hasMultipleItems'), true);
	});

	(0, _emberQunit.test)('returns the current item', function (assert) {
		var component = this.subject();

		component.currentItemIndexObserver = function () {};

		component.set('model', [{
			title: 'Item 1'
		}, {
			title: 'Item 2'
		}]);

		component.set('currentItemIndex', 0);
		assert.deepEqual(component.get('currentItem'), {
			title: 'Item 1'
		});

		component.set('currentItemIndex', 1);
		assert.deepEqual(component.get('currentItem'), {
			title: 'Item 2'
		});
	});

	(0, _emberQunit.test)('sets proper index in the prevItem function', function (assert) {
		var component = this.subject();

		component.currentItemIndexObserver = function () {};

		component.set('model', [{
			title: 'Item 1'
		}, {
			title: 'Item 2'
		}, {
			title: 'Item 3'
		}]);

		component.prevItem();
		assert.equal(component.get('currentItemIndex'), 2);

		component.prevItem();
		assert.equal(component.get('currentItemIndex'), 1);

		component.prevItem();
		assert.equal(component.get('currentItemIndex'), 0);
	});

	(0, _emberQunit.test)('sets proper index in the nextItem function', function (assert) {
		var component = this.subject();

		component.currentItemIndexObserver = function () {};

		component.set('model', [{
			title: 'Item 1'
		}, {
			title: 'Item 2'
		}, {
			title: 'Item 3'
		}]);

		component.nextItem();
		assert.equal(component.get('currentItemIndex'), 1);

		component.nextItem();
		assert.equal(component.get('currentItemIndex'), 2);

		component.nextItem();
		assert.equal(component.get('currentItemIndex'), 0);
	});
});