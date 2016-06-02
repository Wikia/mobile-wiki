import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';
import Ember from 'ember';

const inputSelector = 'input',
	labelSelector = 'label',
	negativeIndex = -1;

moduleForComponent('wikia-ui-components/text-field', 'Integration | Component | text field', {
	integration: true,

	beforeEach() {
		this.set('actionEnter', sinon.spy());
		this.set('actionFocus', sinon.spy());
		this.set('actionBlur', sinon.spy());
	}
});

test('render customized text field correctly', function (assert) {
	const type = 'search',
		defaultInputClassName = 'test-input-class test',
		defaultLabelClassName = 'test-label-class test',
		inputValue = 'some input value',
		labelText = 'test label';

	this.set('type', type);
	this.set('defaultInputClassName', defaultInputClassName);
	this.set('defaultLabelClassName', defaultLabelClassName);
	this.set('inputValue', inputValue);
	this.set('labelText', labelText);

	this.render(hbs`{{wikia-ui-components/text-field
			value=inputValue
			name='infoboxSectionHeader'
			label=labelText
			inputClasses=defaultInputClassName
			labelClassNames=defaultLabelClassName
			type=type
		}}`);

	const input = this.$(inputSelector),
		label = this.$(labelSelector);

	assert.notEqual(input.attr('class').indexOf(defaultInputClassName), negativeIndex);
	assert.notEqual(label.attr('class').indexOf(defaultLabelClassName), negativeIndex);
	assert.equal(input.attr('type'), type);
	assert.equal(input.val(), this.get('inputValue'));
	assert.equal(label.text(), labelText);
});

test('when input focused, proper action is called', function (assert) {
	this.render(hbs`
		{{wikia-ui-components/text-field
			value=inputValue
			name='infoboxSectionHeader'
			label='test label'
			onEnterHandler=actionEnter
			onFocusHandler=actionFocus
			onBlurHandler=actionBlur
		}}
	`);

	this.$(inputSelector).focus();

	assert.equal(this.get('actionFocus').called, true);
	assert.equal(this.get('actionBlur').called, false);
});

test('when enter is hit, proper action is called', function (assert) {
	const enterKeyCode = 13;

	this.render(hbs`
		{{wikia-ui-components/text-field
			value=inputValue
			name='infoboxSectionHeader'
			label='test label'
			onEnterHandler=actionEnter
			onFocusHandler=actionFocus
			onBlurHandler=actionBlur
		}}
	`);

	Ember.run(() => {
		this.$(inputSelector).trigger(
			Ember.$.Event('keyup', {
				keyCode: enterKeyCode
			})
		);
	});

	assert.equal(this.get('actionEnter').called, true);
	assert.equal(this.get('actionFocus').called, false);
	assert.equal(this.get('actionBlur').called, false);
});
