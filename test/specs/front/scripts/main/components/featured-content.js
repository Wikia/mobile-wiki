moduleForComponent('featured-content', 'FeaturedContentComponent', {
	unit: true
});

test('detects if there are multiple items in the model', function () {
	var component = this.subject();
	component.currentItemIndexObserver = Em.K;

	component.set('model', [{
		title: 'Item 1'
	}]);
	equal(component.get('hasMultipleItems'), false);

	component.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}]);
	equal(component.get('hasMultipleItems'), true);
});

test('returns the current item', function () {
	var component = this.subject();
	component.currentItemIndexObserver = Em.K;

	component.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}]);

	component.set('currentItemIndex', 0);
	deepEqual(component.get('currentItem'), {
		title: 'Item 1'
	});

	component.set('currentItemIndex', 1);
	deepEqual(component.get('currentItem'), {
		title: 'Item 2'
	});
});

test('sets proper index in the prevItem function', function () {
	var component = this.subject();
	component.currentItemIndexObserver = Em.K;

	component.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}, {
		title: 'Item 3'
	}]);

	component.prevItem();
	equal(component.get('currentItemIndex'), 2);

	component.prevItem();
	equal(component.get('currentItemIndex'), 1);

	component.prevItem();
	equal(component.get('currentItemIndex'), 0);
});

test('sets proper index in the nextItem function', function () {
	var component = this.subject();
	component.currentItemIndexObserver = Em.K;

	component.set('model', [{
		title: 'Item 1'
	}, {
		title: 'Item 2'
	}, {
		title: 'Item 3'
	}]);

	component.nextItem();
	equal(component.get('currentItemIndex'), 1);

	component.nextItem();
	equal(component.get('currentItemIndex'), 2);

	component.nextItem();
	equal(component.get('currentItemIndex'), 0);
});
