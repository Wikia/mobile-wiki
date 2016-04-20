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

test('test group items calculation', function (assert) {
	const controller = this.subject(),
		cases = [
			{
				model: Ember.Object.create({
					infoboxState: [
						{type: 'section-header', id: 1},
						{type: 'row', id: 2},
						{type: 'row', id: 3}
					]
				}),
				itemIndex: 0,
				expected: [
					{type: 'section-header', id: 1},
					{type: 'row', id: 2},
					{type: 'row', id: 3}
				]
			},
			{
				model: Ember.Object.create({
					infoboxState: [
						{type: 'section-header', id: 1},
						{type: 'row', id: 2},
						{type: 'row', id: 3},
						{type: 'section-header', id: 4}
					]
				}),
				itemIndex: 0,
				expected: [
					{type: 'section-header', id: 1},
					{type: 'row', id: 2},
					{type: 'row', id: 3}
				]
			},
			{
				model: Ember.Object.create({
					infoboxState: [
						{type: 'section-header', id: 1},
						{type: 'row', id: 2},
						{type: 'row', id: 3},
						{type: 'section-header', id: 4}
					]
				}),
				itemIndex: 1,
				expected: []
			},
			{
				model: Ember.Object.create({
					infoboxState: [
						{type: 'section-header', id: 1},
						{type: 'row', id: 2},
						{type: 'title', id: 3},
						{type: 'row', id: 4},
						{type: 'section-header', id: 5}
					]
				}),
				itemIndex: 0,
				expected: [
					{type: 'section-header', id: 1},
					{type: 'row', id: 2}
				]
			},
			{
				model: Ember.Object.create({
					infoboxState: [
						{type: 'section-header', id: 1},
						{type: 'row', id: 2},
						{type: 'section-header', id: 3},
						{type: 'image', id: 4}
					]
				}),
				itemIndex: 2,
				expected: [
					{type: 'section-header', id: 3},
					{type: 'image', id: 4}
				]
			}
		];

	cases.forEach((testCase) => {
		controller.set('model', testCase.model);
		controller.send('setGroup', testCase.model.infoboxState[testCase.itemIndex]);
		assert.deepEqual(controller.get('groupItems'), testCase.expected);
	});
});

test('check the appropriate action is sent on cancel', function (assert) {
	const controller = this.subject(),
		model = {
			saveStateToTemplate: sinon.stub().returns(Ember.RSVP.Promise.resolve()),
		},
		route = {
			send: sinon.spy()
		},
		cases = [
			{
				action: 'cancel',
				isVEContext: true,
				calledWith: 'returnToVE'
			},
			{
				action: 'cancel',
				isVEContext: false,
				calledWith: 'redirectToPage'
			}
		];

	controller.set('model', model);
	controller.set('target', route);

	cases.forEach((testCase) => {
		route.send.reset();

		controller.set('isVEContext', testCase.isVEContext);

		Ember.run(() => controller.send(testCase.action));
		assert.equal(route.send.calledWith(testCase.calledWith), true);
	});
});
