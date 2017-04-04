import {test} from 'ember-qunit';
import {module} from 'qunit';
import ThirdsClicksMixin from 'mobile-wiki/mixins/thirds-click';
import sinon from 'sinon';

module('Unit | Mixin | thirds click', () => {
	test('calls proper handlers on click', (assert) => {
		const mixin = Ember.Object.extend(ThirdsClicksMixin).create(),
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
		assert.ok(mixin.leftClickHandler.calledOnce, 'left click handler is called');

		mixin.callClickHandler(clickEventRight);
		assert.ok(mixin.rightClickHandler.calledOnce, 'right click handler is called');

		mixin.callClickHandler(clickEventCenter);
		assert.ok(mixin.centerClickHandler.calledOnce, 'center click handler is called');
	});
});

