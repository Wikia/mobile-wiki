moduleForComponent('lightbox-wrapper', 'LightboxWrapperComponent');

test('toggleFooter method toggles footerExpanded', function () {
	var componentMock = this.subject();

	equal(componentMock.get('footerExpanded'), false);

	componentMock.send('toggleFooter');
	equal(componentMock.get('footerExpanded'), true);

	componentMock.send('toggleFooter');
	equal(componentMock.get('footerExpanded'), false);
});

test('toggleUI method toggles footerHidden and headerHidden', function () {
	var componentMock = this.subject();

	equal(componentMock.get('footerHidden'), false);
	equal(componentMock.get('headerHidden'), false);

	componentMock.send('toggleUI');
	equal(componentMock.get('footerHidden'), true);
	equal(componentMock.get('headerHidden'), true);

	componentMock.send('toggleUI');
	equal(componentMock.get('footerHidden'), false);
	equal(componentMock.get('headerHidden'), false);
});
