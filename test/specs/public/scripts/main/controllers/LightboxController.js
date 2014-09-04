moduleFor('controller:lightbox', 'Lightbox Controller', {
	setup: function () {

	}
});

test('toggleFooter', function () {
	expect(3);
	var lightboxController = this.subject();

	equal(lightboxController.get('lightboxFooterExpanded'), null);

	lightboxController.send('toggleFooter');

	equal(lightboxController.get('lightboxFooterExpanded'), true);

	lightboxController.send('toggleFooter');

	equal(lightboxController.get('lightboxFooterExpanded'), false);
});

test('hideUI', function () {
	expect(6);
	var lightboxController = this.subject();

	equal(lightboxController.get('footerHidden'), null);
	equal(lightboxController.get('headerHidden'), null);

	lightboxController.send('hideUI');

	equal(lightboxController.get('footerHidden'), true);
	equal(lightboxController.get('headerHidden'), true);

	lightboxController.send('hideUI');

	equal(lightboxController.get('footerHidden'), false);
	equal(lightboxController.get('headerHidden'), false);
});
