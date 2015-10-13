var originalMediaModel;

moduleForComponent('trending-videos', 'TrendingVideosComponent', {
	unit: true,

	setup: function () {
		originalMediaModel = App.MediaModel;

		App.MediaModel = {
			create: function (data) {
				return data;
			}
		};
	},

	teardown: function () {
		App.MediaModel = originalMediaModel;
	}
});

test('handles openLightbox action properly', function () {
	var componentMock = this.subject(),
		video = {
			title: 'pretty video'
		};

	// This is the analogue to openCuratedContentItem='openCuratedContentItem' in the parent template
	componentMock.set('openLightbox', 'openLightbox');

	componentMock.set('targetObject', {
		openLightbox: function (type, data) {
			equal(type, 'media');
			deepEqual(data, {
				media: {
					media: video
				},
				mediaRef: 0
			});
		}
	});
	componentMock.send('openLightbox', video);
});
