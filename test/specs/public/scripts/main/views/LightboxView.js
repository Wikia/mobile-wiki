moduleFor('view:lightbox', 'Lightbox Controller');

test('if toggleFooter method toggles lightboxFooterExpanded property', function () {
	expect(3);
	var lightboxView = this.subject();

	equal(lightboxView.get('lightboxFooterExpanded'), false);

	lightboxView.send('toggleFooter');

	equal(lightboxView.get('lightboxFooterExpanded'), true);

	lightboxView.send('toggleFooter');

	equal(lightboxView.get('lightboxFooterExpanded'), false);
});

test('if toggleUI method properly toggles footerHidden and headerHidden properties', function () {
	expect(6);
	var lightboxView = this.subject();

	equal(lightboxView.get('footerHidden'), false);
	equal(lightboxView.get('headerHidden'), false);

	lightboxView.send('toggleUI');

	equal(lightboxView.get('footerHidden'), true);
	equal(lightboxView.get('headerHidden'), true);

	lightboxView.send('toggleUI');

	equal(lightboxView.get('footerHidden'), false);
	equal(lightboxView.get('headerHidden'), false);
});
