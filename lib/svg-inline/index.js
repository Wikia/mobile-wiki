const svgstore = require('svgstore'),
	fs = require('fs'),
	inlineSVGs = require('../../config/svg').inlineSVGs;

module.exports = {
	name: 'svg-inline',

	contentFor: function (type) {
		if (type === 'svg-inline') {
			const sprites = svgstore();
			inlineSVGs.forEach((inlineSVG) => {
				sprites.add(inlineSVG.name, fs.readFileSync(inlineSVG.path, 'utf8'));
			});
			return sprites.toString({inline: true});
		}
	}
};
