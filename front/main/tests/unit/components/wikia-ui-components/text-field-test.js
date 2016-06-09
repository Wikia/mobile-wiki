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
				value: '0',
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

test('calls appropriate handler on focus, blur, keyUp and enter', function (assert) {
	const component = this.subject(),
		onFocusHandler = sinon.spy(),
		onBlurHandler = sinon.spy(),
		onKeyUpHandler = sinon.spy(),
		onEnterHandler = sinon.spy(),
		eventMock = {},
		cases = [
			{
				action: 'onFocus',
				handlerName: 'onFocusHandler',
				handler: onFocusHandler,
				calledWidthArguments: [eventMock]
			},
			{
				action: 'onBlur',
				handlerName: 'onBlurHandler',
				handler: onBlurHandler,
				calledWidthArguments: [eventMock]

			},
			{
				action: 'onKeyUp',
				handlerName: 'onKeyUpHandler',
				handler: onKeyUpHandler,
				calledWidthArguments: ['test value', eventMock]
			},
			{
				action: 'onEnter',
				handlerName: 'onEnterHandler',
				handler: onEnterHandler,
				calledWidthArguments: [eventMock]
			}
		];

	cases.forEach((testCase) => {
		const calledWidthArguments = testCase.calledWidthArguments;

		component.set(testCase.handlerName, testCase.handler);
		component.send(testCase.action, ...calledWidthArguments);
		assert.equal(testCase.handler.called, true);
		assert.equal(testCase.handler.calledWith(eventMock), true);
	});
});

test('correctly calculates isInvalid', function (assert) {
	const component = this.subject(),
		cases = [
			{
				editorErrorMessage: 'error message',
				isInvalid: true
			},
			{
				editorErrorMessage: null,
				isInvalid: false
			},
			{
				editorErrorMessage: '',
				isInvalid: false
			}
		];

	cases.forEach((testCase) => {
		component.set('errorMessage', testCase.editorErrorMessage);
		assert.equal(component.get('isInvalid'), testCase.isInvalid);
	});
});
