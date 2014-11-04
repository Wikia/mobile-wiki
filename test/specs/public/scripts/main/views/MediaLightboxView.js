moduleFor('view:media-lightbox', 'Media Lightbox Controller');

test('if changeMediaOnTap changes current media', function () {
	expect(2);
	var mediaLightboxView = this.subject({
			nextMedia: function () {
				nextMediaWasTapped = true;
			},
			prevMedia: function () {
				prevMediaWasTapped = true;
			}
		}),
		tapEventRight = {
			center: {
				x: 360
			}
		},
		tapEventLeft = {
			center: {
				x: 120
			}
		},
		nextMediaWasTapped = false,
		prevMediaWasTapped = false;

	Ember.run(function () {
		mediaLightboxView.set('viewportSize', {
			width: 480
		});
	});

	mediaLightboxView.changeMediaOnTap(tapEventRight);
	equal(nextMediaWasTapped, true);

	mediaLightboxView.changeMediaOnTap(tapEventLeft);
	equal(prevMediaWasTapped, true);
});

test('if isCurrentMediaType method recognizes media', function () {
	expect(1);
	var mediaLightboxView = this.subject({
			get: function () {
				return {
					get: function () {
						return {
							type: 'image'
						}
					}
				}
			}
		}),
		isMediaTypeImage = false;

	isMediaTypeImage = mediaLightboxView.isCurrentMediaType('image');
	equal(isMediaTypeImage, true);
});
