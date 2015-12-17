QUnit.module('main/helpers/svg-helper', function (hooks) {
	var svgHelper;

	hooks.beforeEach(function () {
		svgHelper = require('main/helpers/svg-helper').default.compute;
	});

	QUnit.test('SVG helper is exported', function () {
		ok(svgHelper);
	});

	QUnit.test('generate SVG html with name only', function () {
		var options = {},
			html = svgHelper(['nameOfSvg'], options);

		equal(html, '<svg><use xlink:href="#nameOfSvg"></use></svg>');
	});

	QUnit.test('generate html with one hash parameter', function () {
		var options = {
				viewBox: '0 0 12 7'
			},
			html = svgHelper(['nameOfSvg'], options);

		equal(html, '<svg viewBox="0 0 12 7"><use xlink:href="#nameOfSvg"></use></svg>');
	});

	QUnit.test('generate html with three parameters', function () {
		var options = {
				viewBox: '0 0 12 7',
				class: 'css classes here',
				role: 'img'
			},
			html = svgHelper(['nameOfSvg'], options);

		// The helper iterates through hash parameters alphabetically
		equal(html, '<svg class="css classes here" role="img" viewBox="0 0 12 7">' +
			'<use xlink:href="#nameOfSvg"></use></svg>');
	});

	QUnit.test('generate html with extraneous parameter (ignores the param)', function () {
		var options = {
				notAValidSVGParam: 'nope'
			},
			html = svgHelper(['nameOfSvg'], options);

		equal(html, '<svg><use xlink:href="#nameOfSvg"></use></svg>');
	});
});
