module('ThirdsClickMixin');

test('calls proper handlers on click', function () {
	var mock = Em.Object.createWithMixins(App.ThirdsClickMixin, {
			leftClickHandler: function () {
				ok(true, 'left click handler is called');
			},
			rightClickHandler: function () {
				ok(true, 'right click handler is called');
			},
			centerClickHandler: function () {
				ok(true, 'center click handler is called');
			},
			viewportWidth: 480
		}),
		clickEventLeft = {
			clientX: 80
		},
		clickEventRight = {
			clientX: 400
		},
		clickEventCenter = {
			clientX: 200
		};

	mock.callClickHandler(clickEventRight);
	mock.callClickHandler(clickEventLeft);
	mock.callClickHandler(clickEventCenter);
});
