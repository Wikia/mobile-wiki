define('mobile-wiki/tests/unit/mixins/thirds-click-test', ['ember-qunit', 'qunit', 'mobile-wiki/mixins/thirds-click', 'sinon'], function (_emberQunit, _qunit, _thirdsClick, _sinon) {
	'use strict';

	var EmberObject = Ember.Object;


	(0, _qunit.module)('Unit | Mixin | thirds click', function () {
		(0, _emberQunit.test)('calls proper handlers on click', function (assert) {
			var mixin = EmberObject.extend(_thirdsClick.default).create(),
			    clickEventLeft = {
				clientX: 80
			},
			    clickEventRight = {
				clientX: 400
			},
			    clickEventCenter = {
				clientX: 200
			};

			mixin.leftClickHandler = _sinon.default.stub();
			mixin.rightClickHandler = _sinon.default.stub();
			mixin.centerClickHandler = _sinon.default.stub();
			mixin.viewportWidth = 480;

			mixin.callClickHandler(clickEventLeft);
			assert.ok(mixin.leftClickHandler.calledOnce, 'left click handler is called');

			mixin.callClickHandler(clickEventRight);
			assert.ok(mixin.rightClickHandler.calledOnce, 'right click handler is called');

			mixin.callClickHandler(clickEventCenter);
			assert.ok(mixin.centerClickHandler.calledOnce, 'center click handler is called');
		});
	});
});