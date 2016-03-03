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
					type: 'row',
					sourceFrozen: false
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
					collapsible: false,
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

test('edit section header item', (assert) => {
	const index = 0,
		defaultHeader = 'Header 1',
		defaultCollapsible = false,
		data = 'custom header',
		collapsible = true,
		cases = [
			{
				newValues: {
					data,
					collapsible
				},
				expectedValues: {
					data,
					collapsible
				}
			},
			{
				newValues: {
					data
				},
				expectedValues: {
					data,
					collapsible: defaultCollapsible
				}
			},
			{
				newValues: {
					collapsible
				},
				expectedValues: {
					data: defaultHeader,
					collapsible
				}
			},
			{
				newValues: {},
				expectedValues: {
					data: defaultHeader,
					collapsible: defaultCollapsible
				}
			}
		];

	cases.forEach((testCase) => {
		const model = infoboxBuilderModelClass.create();

		sinon.stub(i18n, 't').returns(defaultHeader);

		model.addItem('section-header');
		model.editSectionHeaderItem(model.get('infoboxState').objectAt(index), testCase.newValues);

		assert.equal(model.get(`infoboxState.${index}.data`), testCase.expectedValues.data);
		assert.equal(model.get(`infoboxState.${index}.collapsible`), testCase.expectedValues.collapsible);

		i18n.t.restore();
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
					type: 'row',
					sourceFrozen: true
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
					type: 'row',
					sourceFrozen: true
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
					type: 'row',
					sourceFrozen: true
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
					type: 'row',
					sourceFrozen: true
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
					type: 'row',
					sourceFrozen: false
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
				type: 'row',
				sourceFrozen: false
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

		assert.equal(
			extended.sourceFrozen,
			testCase.expected.sourceFrozen,
			'source freezed'
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

test('extend section header data', (assert) => {
	const index = 1,
		component = 'test-component',
		type = 'section-header',
		defaultName = 'Header 1',
		infoboxBuilderData = {
			index,
			component
		},
		cases = [
			{
				newValues: {
					data: 'custom header',
					collapsible: true
				},
				expected: {
					data: 'custom header',
					collapsible: true
				}
			},
			{
				newValues: {
					data: 'custom header'
				},
				expected: {
					data: 'custom header',
					collapsible: false
				}
			},
			{
				newValues: {
					data: 'custom header',
					collapsible: false
				},
				expected: {
					data: 'custom header',
					collapsible: false
				}
			},
			{
				newValues: {
					collapsible: true
				},
				expected: {
					data: '',
					collapsible: true
				}
			},
			{
				newValues: null,
				expected: {
					data: defaultName,
					collapsible: false
				}
			},
			{
				newValues: {},
				expected: {
					data: '',
					collapsible: false
				}
			},
			{
				newValues: {
					data: ''
				},
				expected: {
					data: '',
					collapsible: false
				}
			}
		];

	cases.forEach((testCase) => {
		const item = {
				data: defaultName,
				collapsible: false,
				infoboxBuilderData,
				type
			},
			extendedObject = infoboxBuilderModelClass.extendHeaderData(item, testCase.newValues);

		assert.equal(extendedObject.data, testCase.expected.data);
		assert.equal(extendedObject.collapsible, testCase.expected.collapsible);
		assert.equal(extendedObject.type, type);
		assert.equal(extendedObject.infoboxBuilderData, infoboxBuilderData);
	});
});

test('set edit item', (assert) => {
	const model = infoboxBuilderModelClass.create(),
		index = 1,
		mockComponentName = 'xyz,',
		cases = [
			{
				item: model.createTitleItem(),
				expectedoriginalData: {
					defaultValue: ''
				}
			},
			{
				item: {
					data: {
						caption: {
							source: 'image caption'
						}
					},
					infoboxBuilderData: {
						index,
						component: 'component'
					},
					type: 'image'
				},
				expectedoriginalData: {
					caption: {
						source: 'image caption'
					}
				}
			},
			{
				item: {
					data: {
						label: 'my label'
					},
					infoboxBuilderData: {
						index,
						component: mockComponentName
					},
					type: 'row'
				},
				expectedoriginalData: {
					label: 'my label'
				}
			},
			{
				item: {
					data: 'test header',
					collapsible: true,
					infoboxBuilderData: {
						index,
						component: mockComponentName
					},
					type: 'section-header'
				},
				expectedoriginalData: {
					value: 'test header',
					collapsible: true
				}
			}
		];

	cases.forEach((testCase) => {
		const model = infoboxBuilderModelClass.create();

		model.setEditItem(testCase.item);

		assert.deepEqual(model.get('itemInEditMode'), testCase.item);
		assert.deepEqual(testCase.item.infoboxBuilderData.originalData, testCase.expectedoriginalData);
	});
});

test('edit section header item', (assert) => {
	const originalDataMock = {
			some_value: 'test'
		},
		titleDiff = [
			{
				type: 'title',
				changedField: 'abc'
			}
		],
		rowDiff = [
			{
				type: 'row',
				changedField: 'abc'
			}
		],
		sectionHeaderDiff = [
			{
				type: 'section-header',
				changedField: 'abc'
			},
			{
				type: 'section-header',
				changedField: 'xyz'
			}
		],
		cases = [
			{
				infoboxState: [],
				expectedDataDiff: []
			},
			{
				infoboxState: [
					{infoboxBuilderData: {}},
					{infoboxBuilderData: {}},
					{infoboxBuilderData: {}}
				],
				expectedDataDiff: []
			},
			{
				infoboxState: [
					{
						infoboxBuilderData: {},
						type: 'title'
					},
					{
						infoboxBuilderData: {},
						type: 'title'
					},
					{
						infoboxBuilderData: {
							originalData: originalDataMock
						},
						type: 'image'
					}
				],
				expectedDataDiff: []
			},
			{
				infoboxState: [
					{
						infoboxBuilderData: {
							originalData: originalDataMock
						},
						type: 'title'
					},
					{infoboxBuilderData: {}},
					{infoboxBuilderData: {}}
				],
				expectedDataDiff: titleDiff
			},
			{
				infoboxState: [
					{
						infoboxBuilderData: {
							originalData: originalDataMock
						},
						type: 'title'
					},
					{
						infoboxBuilderData: {
							originalData: originalDataMock
						},
						type: 'row'
					},
					{infoboxBuilderData: {}}
				],
				expectedDataDiff: titleDiff.concat(rowDiff)
			},
			{
				infoboxState: [
					{
						infoboxBuilderData: {
							originalData: originalDataMock
						},
						type: 'title'
					},
					{
						infoboxBuilderData: {
							originalData: originalDataMock
						},
						type: 'section-header'
					},
					{infoboxBuilderData: {}}
				],
				expectedDataDiff: titleDiff.concat(sectionHeaderDiff[0], sectionHeaderDiff[1])
			},
			{
				infoboxState: [
					{
						infoboxBuilderData: {
							originalData: null
						},
						type: 'title'
					},
					{
						infoboxBuilderData: {
							originalData: originalDataMock
						},
						type: 'row'
					},
					{infoboxBuilderData: {}}
				],
				expectedDataDiff: rowDiff
			}
		];

	sinon.stub(infoboxBuilderModelClass, 'createTitleDiff').returns(titleDiff);
	sinon.stub(infoboxBuilderModelClass, 'createRowDiff').returns(rowDiff);
	sinon.stub(infoboxBuilderModelClass, 'createSectionHeaderDiff').returns(sectionHeaderDiff);

	cases.forEach((testCase) => {
		const model = infoboxBuilderModelClass.create();

		model.set('infoboxState', testCase.infoboxState);

		assert.deepEqual(model.createDataDiffs(), testCase.expectedDataDiff);

	});

	infoboxBuilderModelClass.createTitleDiff.restore();
	infoboxBuilderModelClass.createRowDiff.restore();
	infoboxBuilderModelClass.createSectionHeaderDiff.restore();
});

test('create row diff', (assert) => {
	const cases = [
		{
			originalData: {},
			data: {},
			expected: []
		},
		{
			originalData: {},
			data: {label: 'label'},
			expected: []
		},
		{
			originalData: {label: 'label'},
			data: {label: 'label'},
			expected: []
		},
		{
			originalData: {label: 'label'},
			data: {},
			expected: [{
				type: 'row',
				changedField: 'label'
			}]
		},
		{
			originalData: {label: 'test label'},
			data: {label: ''},
			expected: [{
				type: 'row',
				changedField: 'label'
			}]
		},
		{
			originalData: {label: ''},
			data: {label: 'test label'},
			expected: [{
				type: 'row',
				changedField: 'label'
			}]
		}
	];

	cases.forEach((testCase) => {
		const diff = infoboxBuilderModelClass.createRowDiff(testCase.originalData, testCase.data);

		assert.deepEqual(diff, testCase.expected);
	});
});

test('create title diff', (assert) => {
	const cases = [
		{
			originalData: {},
			data: {},
			expected: []
		},
		{
			originalData: {},
			data: {defaultValue: '{{PAGENAME}}'},
			expected: []
		},
		{
			originalData: {defaultValue: '{{PAGENAME}}'},
			data: {defaultValue: '{{PAGENAME}}'},
			expected: []
		},
		{
			originalData: {defaultValue: ''},
			data: {defaultValue: ''},
			expected: []
		},
		{
			originalData: {defaultValue: '{{PAGENAME}}'},
			data: {},
			expected: [{
				type: 'title',
				changedField: 'defaultValue'
			}]
		},
		{
			originalData: {defaultValue: ''},
			data: {defaultValue: '{{PAGENAME}}'},
			expected: [{
				type: 'title',
				changedField: 'defaultValue'
			}]
		}
	];

	cases.forEach((testCase) => {
		const diff = infoboxBuilderModelClass.createTitleDiff(testCase.originalData, testCase.data);

		assert.deepEqual(diff, testCase.expected);
	});
});

test('create section-header diff', (assert) => {
	const cases = [
		{
			originalData: {},
			value: 'some value',
			collapsible: true,
			expected: []
		},
		{
			originalData: {
				value: 'some value',
				collapsible: true
			},
			value: 'some value',
			collapsible: true,
			expected: []
		},
		{
			originalData: {
				value: 'Header',
				collapsible: false
			},
			value: {},
			collapsible: false,
			expected: [{
				type: 'section-header',
				changedField: 'value'
			}]
		},
		{
			originalData: {
				value: 'Header',
				collapsible: true
			},
			value: 'Header',
			collapsible: false,
			expected: [{
				type: 'section-header',
				changedField: 'collapsible'
			}]
		},
		{
			originalData: {
				value: 'Header',
				collapsible: false
			},
			value: 'Header 2',
			collapsible: true,
			expected: [
				{
					type: 'section-header',
					changedField: 'value'
				},
				{
					type: 'section-header',
					changedField: 'collapsible'
				}
			]
		}
	];

	cases.forEach((testCase) => {
		const diff = infoboxBuilderModelClass.createSectionHeaderDiff(
			testCase.originalData,
			testCase.value,
			testCase.collapsible
		);

		assert.deepEqual(diff, testCase.expected);
	});
});
