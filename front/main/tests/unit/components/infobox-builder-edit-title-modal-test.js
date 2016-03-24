import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('infobox-builder-edit-title-modal', 'Unit | Component | infobox builder edit title modal', {
	unit: true
});

test('correctly calculates value', function (assert) {
	const component = this.subject(),
		cases = [
			{
				title: 'test123',
				returnValue: 'test123'
			},
			{
				title: null,
				returnValue: ''
			}
		];

	cases.forEach((testCase) => {
		component.set('title', testCase.title);
		assert.equal(component.get('value'), testCase.returnValue);
	});
});

test('correctly calculates isConfirmButtonDisabled', function (assert) {
	const component = this.subject(),
		cases = [
			{
				value: 'test',
				isConfirmButtonDisabled: false
			},
			{
				value: '',
				isConfirmButtonDisabled: true
			},
			{
				value: '    ',
				isConfirmButtonDisabled: true
			},
			{
				value: ' test ',
				isConfirmButtonDisabled: false
			}
		];

	cases.forEach((testCase) => {
		component.set('value', testCase.value);
		assert.equal(component.get('isConfirmButtonDisabled'), testCase.isConfirmButtonDisabled);
	});
});
