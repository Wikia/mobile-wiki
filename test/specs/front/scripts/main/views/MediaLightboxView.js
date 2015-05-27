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
			clientX: 400
		},
		tapEventLeft = {
			clientX: 80
		},
		nextMediaWasTapped = false,
		prevMediaWasTapped = false;

	mediaLightboxView.callClickHandler(tapEventRight);
	equal(nextMediaWasTapped, true);

	mediaLightboxView.callClickHandler(tapEventLeft);
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
