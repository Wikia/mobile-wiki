moduleFor('mixin:thirdsClick', 'ThirdsClickMixin');

test('calls proper handlers on click', function () {
	var mixinClass = Ember.Object.extend(App.ThirdsClickMixin),
		mixin = mixinClass.create({
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

	mixin.callClickHandler(clickEventRight);
	mixin.callClickHandler(clickEventLeft);
	mixin.callClickHandler(clickEventCenter);
});
