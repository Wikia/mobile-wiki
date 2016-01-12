moduleFor('mixin:thirds-click', 'ThirdsClickMixin');

test('calls proper handlers on click', function () {
	var mixin = getMixin('thirds-click'),
		clickEventLeft = {
			clientX: 80
		},
		clickEventRight = {
			clientX: 400
		},
		clickEventCenter = {
			clientX: 200
		};

	mixin.leftClickHandler = sinon.stub();
	mixin.rightClickHandler = sinon.stub();
	mixin.centerClickHandler = sinon.stub();
	mixin.viewportWidth = 480;

	mixin.callClickHandler(clickEventLeft);
	ok(mixin.leftClickHandler.calledOnce, 'left click handler is called');

	mixin.callClickHandler(clickEventRight);
	ok(mixin.rightClickHandler.calledOnce, 'right click handler is called');

	mixin.callClickHandler(clickEventCenter);
	ok(mixin.centerClickHandler.calledOnce, 'center click handler is called');
});
