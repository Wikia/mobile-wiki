moduleFor('route:mainPage', 'MainPageRoute');

test('opens curated content section', function () {
	var routeMock = this.subject();

	routeMock.transitionTo = function (routeName, dynamicSegment) {
		equal(routeName, 'mainPage.section');
		equal(dynamicSegment, '~%2560!%2540%2523%2524%2525%255E%2526*()%2520%252B-%253D%257B%257D%255B%255D%257C%253B%253A\'%2522%253C%253E%253F%252C.%252F');
	};

	routeMock.send('openCuratedContentItem', {
		type: 'section',
		label: '~`!@#$%^&*() +-={}[]\|;:\'"<>?,./'
	});
});

test('opens curated content category', function () {
	var routeMock = this.subject();

	routeMock.transitionTo = function (routeName, dynamicSegment) {
		equal(routeName, 'mainPage.category');
		equal(dynamicSegment, '~%2560!%2540%2523%2524%2525%255E%2526*()%2520%252B-%253D%257B%257D%255B%255D%257C%253B%253A\'%2522%253C%253E%253F%252C.%252F');
	};

	routeMock.send('openCuratedContentItem', {
		type: 'category',
		categoryName: '~`!@#$%^&*() +-={}[]\|;:\'"<>?,./'
	});
});
