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
		this.setProperties({
			actionEnter: sinon.spy(),
			actionFocus: sinon.spy(),
			actionBlur: sinon.spy()
		});
	},

	afterEach() {
		this.setProperties({
			actionEnter: sinon.restore(),
			actionFocus: sinon.restore(),
			actionBlur: sinon.restore()
		});
	}
});

test('render customized text field correctly', function (assert) {
	const type = 'search',
		customInputClassName = 'test-input-class test',
		customLabelClassName = 'test-label-class test',
		inputValue = 'some input value',
		labelText = 'test label';

	this.setProperties({
		type,
		customInputClassName,
		customLabelClassName,
		inputValue,
		labelText
	});

	this.render(hbs`{{wikia-ui-components/text-field
			value=inputValue
			name='infoboxSectionHeader'
			label=labelText
			inputClasses=customInputClassName
			labelClassNames=customLabelClassName
			type=type
		}}`);

	const input = this.$(inputSelector),
		label = this.$(labelSelector);

	assert.notEqual(input.attr('class').indexOf(customInputClassName), negativeIndex);
	assert.notEqual(label.attr('class').indexOf(customLabelClassName), negativeIndex);
	assert.equal(input.attr('type'), type);
	assert.equal(input.val(), this.get('inputValue'));
	assert.equal(label.text(), labelText);
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
