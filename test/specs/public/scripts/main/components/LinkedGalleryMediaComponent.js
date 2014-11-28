moduleForComponent('linked-gallery-media', 'Linked Gallery Media Component');

test('sorts media items correctly', function () {
	var mediaMock = [
			{
				galleryRef: 1,
				thumbUrl: 'http://foo.bar.com/thumb.jpg',
				link: 'http://foo.bar.com'
			},
			{
				galleryRef: 2,
				thumbUrl: 'http://foo.bar.com/thumb.jpg'
			},
			{
				galleryRef: 3,
				thumbUrl: 'http://foo.bar.com/thumb.jpg'
			},
			{
				galleryRef: 4,
				thumbUrl: 'http://foo.bar.com/thumb.jpg',
				link: 'http://foo.bar.com'
			}
		],
		expectedSortedMedia = [
			{
				galleryRef: 2,
				thumbUrl: 'http://foo.bar.com/thumb.jpg'
			},
			{
				galleryRef: 3,
				thumbUrl: 'http://foo.bar.com/thumb.jpg'
			},
			{
				galleryRef: 1,
				thumbUrl: 'http://foo.bar.com/thumb.jpg',
				link: 'http://foo.bar.com'
			},
			{
				galleryRef: 4,
				thumbUrl: 'http://foo.bar.com/thumb.jpg',
				link: 'http://foo.bar.com'
			}
		],
		componentMock = this.subject({
			media: mediaMock
		});

	propEqual(componentMock.get('media').sort(componentMock.sortMedia), expectedSortedMedia);
});
