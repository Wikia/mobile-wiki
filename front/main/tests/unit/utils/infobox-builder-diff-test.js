import {module, test} from 'qunit';

module('Unit | Utility | domain', (hooks) => {
	let infoboxBuilderDiff;

	hooks.beforeEach(() => {
		infoboxBuilderDiff = require('main/utils/infobox-builder-diff');
	});

	test('get diff function based on item type', (assert) => {
		const cases = [
			{
				type: 'title',
				expectedDiffFunction: infoboxBuilderDiff.createTitleDiff
			},
			{
				type: 'row',
				expectedDiffFunction: infoboxBuilderDiff.createRowDiff
			},
			{
				type: 'section-header',
				expectedDiffFunction: infoboxBuilderDiff.createSectionHeaderDiff
			},
			{
				type: 'image',
				expectedDiffFunction: null
			}
		];

		cases.forEach((testCase) => {
			assert.deepEqual(infoboxBuilderDiff.getDiffFunctionForItem(testCase.type), testCase.expectedDiffFunction);
		});
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
			const diff = infoboxBuilderDiff.createRowDiff(testCase.originalData, testCase.data);

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
			const diff = infoboxBuilderDiff.createTitleDiff(testCase.originalData, testCase.data);

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
			const diff = infoboxBuilderDiff.createSectionHeaderDiff(
				testCase.originalData,
				testCase.value,
				testCase.collapsible
			);

			assert.deepEqual(diff, testCase.expected);
		});
	});
});
