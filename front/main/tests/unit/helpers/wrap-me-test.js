import {test} from 'ember-qunit';
import {module} from 'qunit';
import wrapMeHelper from 'main/helpers/wrap-me';

module('Unit | Helper | wrap-me', () => {
	test('wrap-me helper is exported', (assert) => {
		assert.ok(wrapMeHelper.compute);
	});

	test('generate default html for passed content', (assert) => {
		const options = {},
			html = wrapMeHelper.compute(['some text'], options);

		assert.equal(html, '<div>some text</div>');
	});

	test('generate html with passed content and one parameter', (assert) => {
		const options = {
				tagName: 'table'
			},
			html = wrapMeHelper.compute(['some text'], options);

		assert.equal(html, '<table>some text</table>');
	});

	test('generate html with passed content and two parameters', (assert) => {
		const options = {
				tagName: 'span',
				className: 'my-class and another'
			},
			html = wrapMeHelper.compute(['some text'], options);

		assert.equal(html, '<span class="my-class and another">some text</span>');
	});

	test('generate html with passed content and extraneous parameter (ignores the param)', (assert) => {
		const options = {
				notAValidParam: 'nope'
			},
			html = wrapMeHelper.compute(['some text'], options);

		assert.equal(html, '<div>some text</div>');
	});

	test('generate html without any content passed', (assert) => {
		const options = {},
			html = wrapMeHelper.compute([], options);

		assert.equal(html, '<div></div>');
	});
});
