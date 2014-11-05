moduleFor('view:media-lightbox', 'Media Lightbox Controller');

test('if changeMediaOnTap changes current media', function () {
	var mediaLightboxView = this.subject({
			nextMedia: function () {
				nextMediaWasTapped = true;
			},
			prevMedia: function () {
				prevMediaWasTapped = true;
			},
			viewportSize: {
				width: 480
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

	mediaLightboxView.changeMediaOnTap(tapEventRight);
	equal(nextMediaWasTapped, true);

	mediaLightboxView.changeMediaOnTap(tapEventLeft);
	equal(prevMediaWasTapped, true);
});

test('if isCurrentMediaType method recognizes media', function () {
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
