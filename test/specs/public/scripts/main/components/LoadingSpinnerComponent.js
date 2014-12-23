moduleForComponent('loading-spinner', 'Loading Spinner Component');

test('should be hidden by default', function () {
	var componentMock = this.subject();

	equal(componentMock.get('hidden'), true, 'hidden should be set to true');
});

test('should be visible if loading param is truthy', function () {
	var componentMock = this.subject({
		loading: true
	});

	equal(componentMock.get('hidden'), false, 'hidden should be set to false');
});

test('should be hidden if loading param is falsy', function () {
	var componentMock = this.subject({
		loading: false
	});

	equal(componentMock.get('hidden'), true, 'hidden should be set to true');
});
