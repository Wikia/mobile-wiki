const fs = require('fs');
const assetMap = require('../../dist/mobile-wiki/assets/assetMap').assets;

// set maximum allowed sizes for each asset in kilobytes
const assetsSizes = {
	'app.css': 84,
	'design-system.svg': 32,
	'lazy.css': 63,
	'mobile-wiki.js': 431,
	'vendor.js': 643,
	'jwplayer/index.css': 19,
	'jwplayer/wikiajwplayer.js': 54
};

function getFileSize(path) {
	const stats = fs.statSync(path);
	return stats.size / 1024;
}

Object.keys(assetsSizes).forEach((fileName) => {
	let realFileName = `assets/${fileName}`;
	if(assetMap[realFileName]) {
		realFileName = assetMap[realFileName];
	}

	const fileSize = getFileSize(`dist/mobile-wiki/${realFileName}`);

	console.log(`Checking ${fileName}`);
	console.log(`Current size: ${fileSize} KB`);
	console.log(`Allowed size: ${assetsSizes[fileName]} KB`);

	if (fileSize > assetsSizes[fileName]) {
		console.error('Failure');
		console.log('Failure. Current file-size is greater than allowed file-size.');
	} else {
		console.log('Success! Current file-size is less than allowed file-size.');
	}
});
