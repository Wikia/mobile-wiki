import {test, moduleFor} from 'ember-qunit';

const infoboxBuilderModelClass = require('main/models/infobox-builder').default;

moduleFor('model:infobox-builder', 'Unit | Model | infobox builder', {
	unit: true
});

test('checks if moving item in infoboxState by given offset is valid', (assert) => {
	const model = infoboxBuilderModelClass.create(),
		cases = [
			{
				position: 0,
				offset: 1,
				result: true
			},
			{
				position: 0,
				offset: 2,
				result: true
			},
			{
				position: 0,
				offset: 3,
				result: false
			},
			{
				position: 2,
				offset: -1,
				result: true
			},
			{
				position: 2,
				offset: -2,
				result: true
			},
			{
				position: 2,
				offset: -3,
				result: false
			},
			{
				position: 0,
				offset: -1,
				result: false
			},
			{
				position: 2,
				offset: 1,
				result: false
			}
		];

	// add 3 items to infobox state
	model.addRowItem();
	model.addRowItem();
	model.addRowItem();

	cases.forEach((testCase) => {
		assert.equal(model.isValidMove(testCase.position, testCase.offset), testCase.result);
	});
});

test('edit title item', (assert) => {
	const model = infoboxBuilderModelClass.create(),
		index = 0,
		cases = [
			{
				useArticletitle: true,
				defaultValue: '{{PAGENAME}}'
			},
			{
				useArticletitle: false,
				defaultValue: ''
			}
		];

	model.addTitleItem();

	cases.forEach((testCase) => {
		model.editTitleItem(model.get('infoboxState').objectAt(index), testCase.useArticletitle);
		assert.equal(model.get(`infoboxState.${index}.data.default`), testCase.defaultValue);
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

		model.addRowItem();
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
