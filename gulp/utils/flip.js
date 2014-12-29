var through = require('through2'),
	flipcss = require('flipcss'),
	util = require('util'),
	path = require('path');

/**
 * This is needed to support RTL languages
 * This will run flipcss on each file in the stream and create a separate file for it
 * app.scss -> app.css and app.rtl.css
 */
module.exports = function flip (options) {
	options = util._extend({
		warnings: true,
		flipPseudo: false,
		flipUrls: true,
		flipSelectors: true
	}, options);

	// creating a stream through which each file will pass
	// returning the file stream
	return through.obj(function(file, enc, done) {
		if (file.isBuffer()) {
			var rtlFile = file.clone();

			rtlFile.path = path.join(rtlFile.base, rtlFile.relative.replace('.', '.rtl.'));
			rtlFile.contents = new Buffer(
				flipcss.flip(
					rtlFile.contents.toString(),
					options.warnings,
					options.flipPseudo,
					options.flipUrls,
					options.flipSelectors
				)
			);

			this.push(rtlFile);
		} else {
			throw new Error('Flip: Only buffer is supported');
		}

		this.push(file);

		return done();
	});
};
