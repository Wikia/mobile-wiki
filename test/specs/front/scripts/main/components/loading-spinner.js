moduleForComponent('loading-spinner', 'LoadingSpinnerComponent', {
	unit: true
});

test('should be hidden by default', function () {
	var componentMock = this.subject();

	equal(componentMock.get('isVisible'), false);
});

test('should be visible if loading param is truthy', function () {
	var componentMock = this.subject({
		active: true
	});

	equal(componentMock.get('isVisible'), true);
});

test('should be hidden if loading param is falsy', function () {
	var componentMock = this.subject({
		active: false
	});

	equal(componentMock.get('isVisible'), false);
});
