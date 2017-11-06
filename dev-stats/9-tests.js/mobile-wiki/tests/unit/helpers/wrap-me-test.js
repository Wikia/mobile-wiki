define('mobile-wiki/tests/unit/helpers/wrap-me-test', ['ember-qunit', 'qunit', 'mobile-wiki/helpers/wrap-me'], function (_emberQunit, _qunit, _wrapMe) {
	'use strict';

	(0, _qunit.module)('Unit | Helper | wrap-me', function () {
		(0, _emberQunit.test)('wrap-me helper is exported', function (assert) {
			assert.ok(_wrapMe.default.compute);
		});

		(0, _emberQunit.test)('generate default html for passed content', function (assert) {
			var options = {},
			    html = _wrapMe.default.compute(['some text'], options);

			assert.equal(html, '<span>some text</span>');
		});

		(0, _emberQunit.test)('generate html with passed content and one parameter', function (assert) {
			var options = {
				tagName: 'table'
			},
			    html = _wrapMe.default.compute(['some text'], options);

			assert.equal(html, '<table>some text</table>');
		});

		(0, _emberQunit.test)('generate html with passed content and two parameters', function (assert) {
			var options = {
				tagName: 'div',
				className: 'my-class and another'
			},
			    html = _wrapMe.default.compute(['some text'], options);

			assert.equal(html, '<div class="my-class and another">some text</div>');
		});

		(0, _emberQunit.test)('generate html with passed content and extraneous parameter (ignores the param)', function (assert) {
			var options = {
				notAValidParam: 'nope'
			},
			    html = _wrapMe.default.compute(['some text'], options);

			assert.equal(html, '<span>some text</span>');
		});

		(0, _emberQunit.test)('generate html without any content passed', function (assert) {
			var options = {},
			    html = _wrapMe.default.compute([], options);

			assert.equal(html, '<span></span>');
		});

		(0, _emberQunit.test)('generate html with unsafe content', function (assert) {
			var options = {},
			    html = _wrapMe.default.compute(['some<script>alert(0);</script>text'], options);

			assert.equal(html, '<span>some&lt;script&gt;alert(0);&lt;/script&gt;text</span>');
		});

		(0, _emberQunit.test)('generate html with a link', function (assert) {
			var options = {
				tagName: 'a',
				href: '/d/g',
				className: 'guidelines-opener'
			},
			    html = _wrapMe.default.compute(['guidelines'], options);

			assert.equal(html, '<a class="guidelines-opener" href="/d/g">guidelines</a>');
		});

		(0, _emberQunit.test)('generate html with a link with a target', function (assert) {
			var options = {
				tagName: 'a',
				href: '/d/g',
				target: '_blank'
			},
			    html = _wrapMe.default.compute(['guidelines'], options);

			assert.equal(html, '<a href="/d/g" target="_blank">guidelines</a>');
		});
	});
});