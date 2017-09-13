const express = require('express');
const config = require('../config/fastboot-server');

module.exports = express.static(config.distPath, {
	setHeaders: (res) => {
		res.set('Cache-Control', `s-maxage=${config.staticAssetsTTL}`);
		res.set('X-Pass-Cache-Control', `public, max-age=${config.staticAssetsTTL}`);
		res.set('Vary', 'accept-encoding');
	}
});
