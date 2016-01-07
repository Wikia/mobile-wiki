import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('linked-gallery-media', 'Unit | Component | linked gallery media', {
	unit: true
});

test('sorts media items correctly', function (assert) {
	const
		mediaMock = [
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
		componentMock = this.subject();

	componentMock.set('media', mediaMock);
	assert.propEqual(componentMock.get('media').sort(componentMock.sortMedia), expectedSortedMedia);
});
