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
	assert.equal(model.get('_itemIndex.section-header'), 0);
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
			},
			{
				dataMock: {
					data: messageMock,
					infoboxBuilderData: {
						index,
						component: mockComponentName
					},
					type: 'section-header'
				},
				message: 'add section-header item'
			}
		];

	cases.forEach((testCase) => {
		const model = infoboxBuilderModelClass.create(),
			addToStateSpy = sinon.spy(model, 'addToState');

		sinon.stub(i18n, 't').returns(messageMock);
		sinon.stub(infoboxBuilderModelClass, 'createComponentName').returns(mockComponentName);
		model.increaseItemIndex = sinon.stub().returns(index);

		model.addItem(testCase.dataMock.type);

		assert.equal(addToStateSpy.callCount, 1, testCase.message);
		assert.equal(addToStateSpy.calledWith(testCase.dataMock), true, testCase.message);

		// restore static methods
		infoboxBuilderModelClass.createComponentName.restore();
		i18n.t.restore();
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
	const index = 1,
		cases = [
			{
				additionalItemData: {
					data: {
						label: 'custom label'
					},
					source: 'src',
					randomInvalidField: 666
				},
				expected: {
					data: {
						label: 'custom label'
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: 'src',
					type: 'row'
				}
			},
			{
				additionalItemData: {
					data: {
						label: ''
					},
					source: ''
				},
				expected: {
					data: {
						label: ''
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: '',
					type: 'row'
				}
			},
			{
				additionalItemData: {
					data: {
						label: null
					},
					source: ''
				},
				expected: {
					data: {
						label: ''
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: '',
					type: 'row'
				}
			},
			{
				additionalItemData: {},
				expected: {
					data: {
						label: ''
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: '',
					type: 'row'
				}
			},
			{
				additionalItemData: null,
				expected: {
					data: {
						label: 'label 1'
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: 'row1',
					type: 'row'
				}
			}
		];

	cases.forEach((testCase) => {
		const item = {
				data: {
					label: 'label 1'
				},
				infoboxBuilderData: {
					index,
					component: 'component'
				},
				source: 'row1',
				type: 'row'
			},
			extended = infoboxBuilderModelClass.extendRowData(item, testCase.additionalItemData);

		assert.equal(
			extended.source,
			testCase.expected.source,
			'row source'
		);

		assert.equal(
			extended.data.label,
			testCase.expected.data.label,
			'row label'
		);
	});
});

test('extend title data', (assert) => {
	const index = 1,
		cases = [
			{
				additionalItemData: {
					data: {
						defaultValue: 'some default'
					},
					source: 'src',
					randomInvalidField: 666
				},
				expected: {
					data: {
						defaultValue: 'some default'
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: 'src',
					type: 'title'
				}
			},
			{
				additionalItemData: {
					data: {
						defaultValue: null
					},
					source: ''
				},
				expected: {
					data: {
						defaultValue: ''
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: '',
					type: 'title'
				}
			},
			{
				additionalItemData: {},
				expected: {
					data: {
						defaultValue: 'some default'
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: '',
					type: 'title'
				}
			},
			{
				additionalItemData: null,
				expected: {
					data: {
						defaultValue: 'some default'
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: 'title1',
					type: 'title'
				}
			}
		];

	cases.forEach((testCase) => {
		const item = {
				data: {
					defaultValue: 'label 1'
				},
				infoboxBuilderData: {
					index,
					component: 'component'
				},
				source: 'title1',
				type: 'title'
			},
			extended = infoboxBuilderModelClass.extendTitleData(item, testCase.additionalItemData);

		assert.equal(
			extended.source,
			testCase.expected.source,
			'title source'
		);

		assert.equal(
			extended.data.label,
			testCase.expected.data.label,
			'title label'
		);
	});
});

test('extend image data', (assert) => {
	const index = 1,
		cases = [
			{
				additionalItemData: {
					data: {
						caption: {
							source: 'my image CAPTION!'
						}
					},
					source: 'obrazek',
					randomInvalidField: 666
				},
				expected: {
					data: {
						caption: {
							source: 'my image CAPTION!'
						}
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: 'obrazek',
					type: 'image'
				}
			},
			{
				additionalItemData: {
					data: {
						caption: {
							source: null
						}
					},
					source: ''
				},
				expected: {
					data: {
						caption: {
							source: ''
						}
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: '',
					type: 'image'
				}
			},
			{
				additionalItemData: {},
				expected: {
					data: {
						caption: {
							source: ''
						}
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: '',
					type: 'image'
				}
			},
			{
				additionalItemData: null,
				expected: {
					data: {
						caption: {
							source: 'caption1'
						}
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					source: 'image1',
					type: 'image'
				}
			}
		];

	cases.forEach((testCase) => {
		const item = {
				data: {
					caption: {
						source: 'caption1'
					}
				},
				infoboxBuilderData: {
					index,
					component: 'component'
				},
				source: 'image1',
				type: 'image'
			},
			extended = infoboxBuilderModelClass.extendImageData(item, testCase.additionalItemData);

		assert.equal(
			extended.source,
			testCase.expected.source,
			'image source'
		);

		assert.equal(
			extended.data.caption.source,
			testCase.expected.data.caption.source,
			'image caption source'
		);
	});
});
