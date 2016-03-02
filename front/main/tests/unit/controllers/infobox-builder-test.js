import {test, moduleFor} from 'ember-qunit';
import sinon from 'sinon';

const saveStateToTemplateStub = sinon.stub(),
	modelMock = Ember.Object.create({
		addItem: sinon.spy(),
		removeItem: sinon.spy(),
		editRowItem: sinon.spy(),
		editTitleItem: sinon.spy(),
		updateInfoboxStateOrder: sinon.spy(),
		saveStateToTemplate: saveStateToTemplateStub
	}),
	routeMock = {
		send: sinon.spy()
	},
	stubReturnMock = {
		then: sinon.spy()
	};

saveStateToTemplateStub.returns(stubReturnMock);

moduleFor('controller:infobox-builder', 'Unit | Controller | infobox builder', {});

test('sets dirty flag to "true" for all action that are changing model state', function (assert) {
	const controller = this.subject(),
		cases = [
			'updateInfoboxStateOrder',
			'editRowItem',
			'editTitleItem',
			'removeItem',
			'addItem'
		];

	controller.set('model', modelMock);

	cases.forEach((testCase) => {
		controller.send(testCase);
		assert.equal(controller.get('isDirty'), true, testCase);
		controller.set('isDirty', false);
	});
});

test('sets dirty flag to "false" on save', function (assert) {
	const controller = this.subject();

	controller.set('model', modelMock);
	controller.set('target', routeMock);

	controller.set('isDirty', true);
	controller.send('save');

	assert.equal(controller.get('isDirty'), false);
});

//test('test resetting item in edit model', function (assert) {
//	const controller = this.subject(),
//		actionTriggerItemMock = {test: 1},
//		resetEditModeSpy = sinon.spy(),
//		modelMock = Ember.Object.create({
//			itemInEditMode: actionTriggerItemMock,
//			resetEditMode: resetEditModeSpy
//		}),
//		cases = [
//			{
//				actionTrigger: actionTriggerItemMock,
//				wasReset: false,
//				message: 'should not reset item in edit mode if it match actionTrigger'
//			},
//			{
//				actionTrigger: {test: 2},
//				wasReset: true,
//				message: 'should not reset item in edit mode if it match actionTrigger'
//			}
//		];
//
//	controller.set('model', modelMock);
//	cases.forEach((testCase) => {
//		controller.send('handleItemInEditMode', testCase.actionTrigger);
//		assert.equal(resetEditModeSpy.called, testCase.wasReset, testCase.message);
//	});
//});
