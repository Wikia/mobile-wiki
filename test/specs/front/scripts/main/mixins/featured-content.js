moduleFor('mixin:featured-content', 'FeaturedContentMixin');

function getFeaturedContentMixin() {
	var mixin = getMixin('featured-content');

	// We don't want to test jQuery DOM manipulation here
	mixin.currentItemIndexObserver = Em.K;

	return mixin;
}

test('detects if there are multiple items in the model', function () {
	var mixin = getFeaturedContentMixin();

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
	var mixin = getFeaturedContentMixin();

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
	var mixin = getFeaturedContentMixin();

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
	var mixin = getFeaturedContentMixin();

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
