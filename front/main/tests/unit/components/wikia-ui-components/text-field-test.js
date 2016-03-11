import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

moduleForComponent('wikia-ui-components/text-field', 'Unit | Component | text field', {
	unit: true
});

test('sets correct value for isLabelFloating', function (assert) {
	const component = this.subject(),
		cases = [
			{
				isFocused: true,
				value: 'test',
				isLabelFloating: true
			},
			{
				isFocused: true,
				value: '',
				isLabelFloating: true
			},
			{
				isFocused: false,
				value: 'test',
				isLabelFloating: true
			},
			{
				isFocused: false,
				value: '',
				isLabelFloating: false
			}
		];

	cases.forEach((testCase) => {
		component.set('isFocused', testCase.isFocused);
		component.set('value', testCase.value);
		assert.equal(component.get('isLabelFloating'), testCase.isLabelFloating);
	});
});

test('sets correct value for labelClassNames', function (assert) {
	const component = this.subject(),
		defaultClassName = 'text-field-label',
		floatingLabelClassName = 'text-field-label--floating',
		cases = [
			{
				isLabelFloating: true,
				classNames: [defaultClassName, floatingLabelClassName].join(' ')
			},
			{
				isLabelFloating: false,
				classNames: defaultClassName
			}
		];

	cases.forEach((testCase) => {
		component.set('isLabelFloating', testCase.isLabelFloating);
		assert.equal(component.get('labelClassNames'), testCase.classNames);
	});
});

test('correctly sets isFocused flag on input focus and blur', function (assert) {
	const component = this.subject(),
		cases = [
			{
				action: 'onFocus',
				isFocused: true
			},
			{
				action: 'onBlur',
				isFocused: false
			}
		];

	cases.forEach((testCase) => {
		component.send(testCase.action);
		assert.equal(component.get('isFocused'), testCase.isFocused);

	});
});

test('calls appropriate handler on focus and blur', function (assert) {
	const component = this.subject(),
		onFocusHandler = sinon.spy(),
		onBlurHandler = sinon.spy(),
		eventMock = {},
		cases = [
			{
				action: 'onFocus',
				handlerName: 'onFocusHandler',
				handler: onFocusHandler
			},
			{
				action: 'onBlur',
				handlerName: 'onBlurHandler',
				handler: onBlurHandler
			}
		];

	cases.forEach((testCase) => {
		component.set(testCase.handlerName, testCase.handler);
		component.send(testCase.action, eventMock);
		assert.equal(testCase.handler.called, true);
		assert.equal(testCase.handler.calledWith(eventMock), true);
	});
});
