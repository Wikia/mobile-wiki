var mixinMock;

moduleFor('mixin:featuredContent', 'FeaturedContentMixin', {
	setup: function () {
		mixinMock = Em.Object.createWithMixins(App.FeaturedContentMixin, {
			// We don't want to test jQuery DOM manipulation here
			currentItemIndexObserver: function () {}
		});
	}
});

test('detects if there are multiple items in the model', function () {
	mixinMock.set('model', [{
		title: 'Item 1'
	}]);
	equal(mixinMock.get('hasMultipleItems'), false);

	mixinMock.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}]);
	equal(mixinMock.get('hasMultipleItems'), true);
});

test('returns the current item', function () {
	mixinMock.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}]);

	mixinMock.set('currentItemIndex', 0);
	deepEqual(mixinMock.get('currentItem'), {
		title: 'Item 1'
	});

	mixinMock.set('currentItemIndex', 1);
	deepEqual(mixinMock.get('currentItem'), {
		title: 'Item 2'
	});
});

test('sets proper index in the prevItem function', function () {
	mixinMock.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}, {
		title: 'Item 3'
	}]);

	mixinMock.prevItem();
	equal(mixinMock.get('currentItemIndex'), 2);

	mixinMock.prevItem();
	equal(mixinMock.get('currentItemIndex'), 1);

	mixinMock.prevItem();
	equal(mixinMock.get('currentItemIndex'), 0);
});

test('sets proper index in the nextItem function', function () {
	mixinMock.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}, {
		title: 'Item 3'
	}]);

	mixinMock.nextItem();
	equal(mixinMock.get('currentItemIndex'), 1);

	mixinMock.nextItem();
	equal(mixinMock.get('currentItemIndex'), 2);

	mixinMock.nextItem();
	equal(mixinMock.get('currentItemIndex'), 0);
});
