define('mobile-wiki/tests/unit/helpers/svg-test', ['ember-qunit', 'qunit', 'mobile-wiki/helpers/svg'], function (_emberQunit, _qunit, _svg) {
	'use strict';

	(0, _qunit.module)('Unit | Helper | svg', function () {
		(0, _emberQunit.test)('SVG helper is exported', function (assert) {
			assert.ok(_svg.default.compute);
		});

		(0, _emberQunit.test)('generate SVG html with name only', function (assert) {
			var options = {},
			    html = _svg.default.compute(['nameOfSvg'], options);

			assert.equal(html, '<svg><use xlink:href="#nameOfSvg"></use></svg>');
		});

		(0, _emberQunit.test)('generate html with one hash parameter', function (assert) {
			var options = {
				viewBox: '0 0 12 7'
			},
			    html = _svg.default.compute(['nameOfSvg'], options);

			assert.equal(html, '<svg viewBox="0 0 12 7"><use xlink:href="#nameOfSvg"></use></svg>');
		});

		(0, _emberQunit.test)('generate html with three parameters', function (assert) {
			var options = {
				viewBox: '0 0 12 7',
				class: 'css classes here',
				role: 'img'
			},
			    html = _svg.default.compute(['nameOfSvg'], options);

			// The helper iterates through hash parameters alphabetically
			assert.equal(html, '<svg class="css classes here" role="img" viewBox="0 0 12 7">' + '<use xlink:href="#nameOfSvg"></use></svg>');
		});

		(0, _emberQunit.test)('generate html with extraneous parameter (ignores the param)', function (assert) {
			var options = {
				notAValidSVGParam: 'nope'
			},
			    html = _svg.default.compute(['nameOfSvg'], options);

			assert.equal(html, '<svg><use xlink:href="#nameOfSvg"></use></svg>');
		});
	});
});