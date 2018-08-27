const svgstore = require('svgstore');
const fs = require('fs');
const inlineSVGs = require('../../config/svg').inlineSVGs;

module.exports = {
	name: 'svg-inline',

	contentFor(type) {
		if (type === 'svg-inline') {
			const sprites = svgstore();
			inlineSVGs.forEach((inlineSVG) => {
				sprites.add(inlineSVG.name, fs.readFileSync(inlineSVG.path, 'utf8'));
			});
			return sprites.toString({
				inline: true,
				svgAttrs: {
					style: 'height: 0; width: 0; position: absolute; overflow: hidden;',
				},
			});
		}

		return undefined;
	},
};
