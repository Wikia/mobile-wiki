import Ember from 'ember';
import {test, moduleFor} from 'ember-qunit';
import sinon from 'sinon';

const infoboxBuilderModelClass = require('main/models/infobox-builder').default;

moduleFor('model:infobox-builder', 'Unit | Model | infobox builder', {
	unit: true
});

test('create new model with initial state', (assert) => {
	const model = infoboxBuilderModelClass.create();

	assert.equal(model.get('itemInEditMode'), null);
	assert.equal(model.get('_itemIndex.row'), 0);
	assert.equal(model.get('_itemIndex.image'), 0);
	assert.equal(model.get('_itemIndex.title'), 0);
	assert.equal(Ember.isArray(model.get('infoboxState')), true);
	assert.equal(model.get('infoboxState').length, 0);
});

test('add item to infobox state', (assert) => {
	const cases = [
		{
			items: [
				{test: 1}
			],
			length: 1
		},
		{
			items: [
				{test: 1},
				{test: 2}
			],
			length: 2
		}
	];

	cases.forEach((testCase) => {
		const model = infoboxBuilderModelClass.create();

		testCase.items.forEach((item) => model.addToState(item));
		assert.equal(model.get('infoboxState').length, testCase.length);
		testCase.items.forEach((item, index) => {
			assert.equal(model.get(`infoboxState.${index}.test`), item.test);
		});
	});
});

test('add items by type', (assert) => {
	const index = 1,
		mockComponentName = 'test-component',
		messageMock = 'testMessage',
		cases = [
			{
				dataMock: {
					data: {
						label: messageMock
					},
					infoboxBuilderData: {
						index,
						component: mockComponentName
					},
					source: `row${index}`,
					type: 'row'
				},
				message: 'add row item'
			},
			{
				dataMock: {
					data: {
						caption: {
							source: `caption${index}`
						}
					},
					infoboxBuilderData: {
						index,
						component: mockComponentName
					},
					source: `image${index}`,
					type: 'image'
				},
				message: 'add image item'
			},
			{
				dataMock: {
					data: {
						defaultValue: ''
					},
					infoboxBuilderData: {
						index,
						component: mockComponentName
					},
					source: `title${index}`,
					type: 'title'
				},
				message: 'add title item'
			}
		];

	cases.forEach((testCase) => {
		const model = infoboxBuilderModelClass.create(),
			addToStateSpy = sinon.spy(),
			createComponentNameStub = sinon
				.stub(infoboxBuilderModelClass, 'createComponentName')
				.returns(mockComponentName),
			i18nStub = sinon.stub(i18n, 't').returns(messageMock);

		i18n.t = i18nStub;
		infoboxBuilderModelClass.createComponentName = createComponentNameStub;

		model.increaseItemIndex = sinon.stub().returns(index);
		model.addToState = addToStateSpy;
		model.addItem(testCase.dataMock.type);

		assert.equal(addToStateSpy.callCount, 1, testCase.message);
		assert.equal(addToStateSpy.calledWith(testCase.dataMock), true, testCase.message);

		// restore global stubs
		createComponentNameStub.restore();
		i18nStub.restore();
	});
});

test('create component name', (assert) => {
	const type = 'test',
		componentName = `infobox-builder-item-${type}`;

	assert.equal(infoboxBuilderModelClass.createComponentName(type), componentName);
});

test('edit title item', (assert) => {
	const model = infoboxBuilderModelClass.create(),
		index = 0,
		cases = [
			{
				useArticleTitle: true,
				defaultValue: '{{PAGENAME}}'
			},
			{
				useArticleTitle: false,
				defaultValue: ''
			}
		];

	model.addItem('title');

	cases.forEach((testCase) => {
		model.editTitleItem(model.get('infoboxState').objectAt(index), testCase.useArticleTitle);
		assert.equal(model.get(`infoboxState.${index}.data.defaultValue`), testCase.defaultValue);
	});
});

test('edit row item', (assert) => {
	const index = 0,
		cases = [
			{
				input: 'test',
				label: 'test',
				source: 'test',
				message: 'updates source value based on custom label'
			},
			{
				input: '',
				label: '',
				source: 'row1'
			}
		];

	cases.forEach((testCase) => {
		const model = infoboxBuilderModelClass.create();

		model.addItem('row');
		model.editRowItem(model.get('infoboxState').objectAt(index), testCase.input);

		assert.equal(model.get(`infoboxState.${index}.data.label`), testCase.label);
		assert.equal(model.get(`infoboxState.${index}.source`), testCase.source);
	});
});

test('sanitize custom row source', (assert) => {
	const cases = [
		{
			input: 'TEST',
			output: 'test'
		},
		{
			input: 'TEST TEST',
			output: 'test_test'
		},
		{
			input: 'Test    Test  TEST',
			output: 'test_test_test'
		},
		{
			input: '  TEST   TEST   ',
			output: 'test_test'
		}
	];

	cases.forEach((testCase) => assert.equal(
		infoboxBuilderModelClass.sanitizeCustomRowSource(testCase.input), testCase.output
	));
});

test('extend row data', (assert) => {
	const model = infoboxBuilderModelClass.create(),
		cases = [
			{
				additionalItemData: {
					data: {
						label: 'custom label'
					},
					source: 'src',
					randomInvalidField: 666
				},
				expectedSource: 'src',
				expectedLabel: 'custom label'
			},
			{
				additionalItemData: {
					data: {
						label: ''
					},
					source: ''
				},
				expectedSource: '',
				expectedLabel: ''
			},
			{
				additionalItemData: null,
				expected: 'row1',
				expectedLabel: ''
			}
		];

	cases.forEach((testCase) => {
		const item = model.createRowItem(),
			expected = item;

		// we want new object to have the same structure like the passed
		// item only with this two fields updated
		expected.source = testCase.expectedSource;
		expected.data = testCase.expectedLabel;

		assert.equal(
			infoboxBuilderModelClass.extendItemData(item, testCase.additionalItemData),
			expected
		);
	});
});
