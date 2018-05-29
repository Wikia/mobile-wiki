const fs = require('fs');
const assetMap = require('../../dist/mobile-wiki/assets/assetMap').assets;

// set maximum allowed sizes for each asset in kilobytes
const assetsSizes = {
	'app.css': 50,
	'design-system.svg': 34,
	'lazy.css': 54.5,
	'mobile-wiki.js': 385,
	'vendor.js': 640,
	'jwplayer/index.css': 19,
	'jwplayer/wikiajwplayer.js': 58
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
