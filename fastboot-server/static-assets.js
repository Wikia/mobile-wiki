const express = require('express');
const config = require('../config/fastboot-server');

const shortTTLAssets = ['webEditor/JWPlayer.js'];

const isShortTTLAsset = path => shortTTLAssets.some(asset => path.endsWith(asset));

module.exports = express.static(config.distPath, {
  setHeaders: (res, path) => {
    const ttl = isShortTTLAsset(path) ? 5 * 60 : config.staticAssetsTTL;

    res.set('Cache-Control', `s-maxage=${ttl}`);
    res.set('X-Pass-Cache-Control', `public, max-age=${ttl}`);
    res.set('Vary', 'accept-encoding');
  },
});
