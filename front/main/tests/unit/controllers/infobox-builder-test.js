import {test, moduleFor} from 'ember-qunit';
import sinon from 'sinon';

moduleFor('controller:infobox-builder', {});

test('test resetting item in edit model', function (assert) {
	const controller = this.subject(),
		actionTriggerItemMock = {test: 1},
		resetEditModeSpy = sinon.spy(),
		modelMock = Ember.Object.create({
			itemInEditMode: actionTriggerItemMock,
			resetEditMode: resetEditModeSpy
		}),
		cases = [
			{
				actionTrigger: actionTriggerItemMock,
				wasReset: false,
				message: 'should not reset item in edit mode if it match actionTrigger'
			},
			{
				actionTrigger: {test: 2},
				wasReset: true,
				message: 'should not reset item in edit mode if it match actionTrigger'
			}
		];

	controller.set('model', modelMock);
	cases.forEach((testCase) => {
		controller.send('handleItemInEditMode', testCase.actionTrigger);
		assert.equal(resetEditModeSpy.called, testCase.wasReset, testCase.message);
	});
});
