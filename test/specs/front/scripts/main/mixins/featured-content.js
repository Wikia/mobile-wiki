var mixin;

moduleFor('mixin:featuredContent', 'FeaturedContentMixin', {
	setup: function () {
		var mixinClass = Ember.Object.extend(App.FeaturedContentMixin);

		mixin = mixinClass.create({
			// We don't want to test jQuery DOM manipulation here
			currentItemIndexObserver: function () {
			}
		});
	}
});

test('detects if there are multiple items in the model', function () {
	mixin.set('model', [{
		title: 'Item 1'
	}]);
	equal(mixin.get('hasMultipleItems'), false);

	mixin.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}]);
	equal(mixin.get('hasMultipleItems'), true);
});

test('returns the current item', function () {
	mixin.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}]);

	mixin.set('currentItemIndex', 0);
	deepEqual(mixin.get('currentItem'), {
		title: 'Item 1'
	});

	mixin.set('currentItemIndex', 1);
	deepEqual(mixin.get('currentItem'), {
		title: 'Item 2'
	});
});

test('sets proper index in the prevItem function', function () {
	mixin.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}, {
		title: 'Item 3'
	}]);

	mixin.prevItem();
	equal(mixin.get('currentItemIndex'), 2);

	mixin.prevItem();
	equal(mixin.get('currentItemIndex'), 1);

	mixin.prevItem();
	equal(mixin.get('currentItemIndex'), 0);
});

test('sets proper index in the nextItem function', function () {
	mixin.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}, {
		title: 'Item 3'
	}]);

	mixin.nextItem();
	equal(mixin.get('currentItemIndex'), 1);

	mixin.nextItem();
	equal(mixin.get('currentItemIndex'), 2);

	mixin.nextItem();
	equal(mixin.get('currentItemIndex'), 0);
});
