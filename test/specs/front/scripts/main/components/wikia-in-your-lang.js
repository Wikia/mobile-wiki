moduleForComponent('wikia-in-your-lang', 'WikiaInYourLangComponent', {
	unit: true,

	setup: function() {
		window.localStorage.clear();
	},

	//mock
	isJapaneseBrowser: function() {
		return true;
	},

	isJapaneseWikia: function() {
		return false;
	}
});

test('createAlert', function() {
	var componentMock = this.subject();
	equal(componentMock.alertNotifications.length, 0, 'should have no alert');
	componentMock.createAlert({message: 'hello', nativeDomain: 'wikia.com'});
	equal(componentMock.alertNotifications.length, 1, 'should have 1 alert');
	equal(componentMock.alertNotifications[0].message, 'hello', 'should be the created alert');
});
