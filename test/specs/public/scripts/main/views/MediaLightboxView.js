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

	mediaLightboxView.handleClick(tapEventRight);
	equal(nextMediaWasTapped, true);

	mediaLightboxView.handleClick(tapEventLeft);
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

test('if getScreenArea correctly returns screen areas', function () {
	var mediaLightboxView = this.subject({
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
		tapEventCenter = {
			clientX: 240
		},
		screenArea,
		screenAreas = mediaLightboxView.get('screenAreas');

	screenArea = mediaLightboxView.getScreenArea(tapEventLeft);
	equal(screenArea, screenAreas.left);

	screenArea = mediaLightboxView.getScreenArea(tapEventRight);
	equal(screenArea, screenAreas.right);

	screenArea = mediaLightboxView.getScreenArea(tapEventCenter);
	equal(screenArea, screenAreas.center);
});
