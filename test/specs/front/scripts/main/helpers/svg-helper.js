module('Handlebars SVG Helper');

test('SVG helper is registered', function () {
	ok(Em.Handlebars.helpers.svg);
});

test('generate SVG html with name only', function () {
	var options ={
			hash: {}
		},
		html = Em.Handlebars.helpers.svg('nameOfSvg', options);
	equal(html, '<svg><use xlink:href="#nameOfSvg"></use></svg>');
});

test('generate html with one hash parameter', function () {
	var options = {
			hash: {
				viewBox: '0 0 12 7'
			}
		},
		html = Em.Handlebars.helpers.svg('nameOfSvg', options);
	equal(html, '<svg viewBox="0 0 12 7"><use xlink:href="#nameOfSvg"></use></svg>');
});

test('generate html with three parameters', function () {
	var options = {
			hash: {
				viewBox: '0 0 12 7',
				class: 'css classes here',
				role: 'img'
			}
		},
		html = Em.Handlebars.helpers.svg('nameOfSvg', options);
	// The helper iterates through hash parameters alphabetically
	equal(html, '<svg class="css classes here" role="img" viewBox="0 0 12 7">' +
		'<use xlink:href="#nameOfSvg"></use></svg>');
});

test('generate html with extraneous parameter (ignores the param)', function () {
	var options = {
			hash: {
				notAValidSVGParam: 'nope'
			}
		},
		html = Em.Handlebars.helpers.svg('nameOfSvg', options);
	equal(html, '<svg><use xlink:href="#nameOfSvg"></use></svg>');
});
