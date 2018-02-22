import {module, test} from 'qunit';
import svgHelper from 'mobile-wiki/helpers/svg';

module(() => {
	test('SVG helper is exported', (assert) => {
		assert.ok(svgHelper.compute);
	});

	test('generate SVG html with name only', (assert) => {
		const options = {},
			html = svgHelper.compute(['nameOfSvg'], options);

		assert.equal(html, '<svg><use xlink:href="#nameOfSvg"></use></svg>');
	});

	test('generate html with one hash parameter', (assert) => {
		const options = {
				viewBox: '0 0 12 7'
			},
			html = svgHelper.compute(['nameOfSvg'], options);

		assert.equal(html, '<svg viewBox="0 0 12 7"><use xlink:href="#nameOfSvg"></use></svg>');
	});

	test('generate html with three parameters', (assert) => {
		const options = {
				viewBox: '0 0 12 7',
				class: 'css classes here',
				role: 'img'
			},
			html = svgHelper.compute(['nameOfSvg'], options);

		// The helper iterates through hash parameters alphabetically
		assert.equal(html, '<svg class="css classes here" role="img" viewBox="0 0 12 7">' +
			'<use xlink:href="#nameOfSvg"></use></svg>');
	});

	test('generate html with extraneous parameter (ignores the param)', (assert) => {
		const options = {
				notAValidSVGParam: 'nope'
			},
			html = svgHelper.compute(['nameOfSvg'], options);

		assert.equal(html, '<svg><use xlink:href="#nameOfSvg"></use></svg>');
	});
}, () => {
});
