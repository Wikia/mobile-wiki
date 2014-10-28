/* global Wikia */
QUnit.module('Thumbnailer tests');

QUnit.test('Thumbnailer is compiled into Mercury.Modules namespace', function () {
	ok(Mercury.Modules.Thumbnailer);
	equal(typeof Mercury.Modules.Thumbnailer, 'function');
});

QUnit.test('Thumbnailer creates thumbnail URL', function () {
	var testCases = [
		{
			url: 'http://static.igor.wikia-dev.com/__cb20130614225714/thelastofus/images/9/99/Robert.png',
			mode: Mercury.Modules.Thumbnailer.mode.topCrop,
			width: 500,
			height: 200,
			hasWebPSupport: true,
			expectedOutput: 'http://vignette.wikia-dev.com/thelastofus/images/9/99/Robert.png/revision/latest' +
			'/top-crop/width/500/height/200?cb=20130614225714&format=webp'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			mode: Mercury.Modules.Thumbnailer.mode.fixedAspectRatio,
			width: 100,
			height: 100,
			hasWebPSupport: false,
			expectedOutput: 'http://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
			'/fixed-aspect-ratio/width/100/height/100?cb=20100311231730'
		}
	];

	testCases.forEach(function (testCase) {
		Mercury.Modules.Thumbnailer.hasWebPSupport = testCase.hasWebPSupport;
		equal(
			Mercury.Modules.Thumbnailer.getThumbURL(testCase.url, testCase.mode, testCase.width, testCase.height),
			testCase.expectedOutput
		);
	});
});

QUnit.test('Thumbnailer verifies legacy thumbnailer URL', function () {
	var testCases = [
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png' +
			'/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: true
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb0/common/avatars/thumb/7/7c/1271044.png/100px-1271044.png.jpg',
			expectedOutput: true
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			expectedOutput: false
		},
		{
			url: 'http://vignette.wikia-dev.com/thelastofus/9/99/Robert.png',
			expectedOutput: false
		}
	];

	testCases.forEach(function (testCase) {
		equal(Mercury.Modules.Thumbnailer.isLegacyThumbnailerUrl(testCase.url), testCase.expectedOutput);
	});
});

QUnit.test('Thumbnailer verifies thumbnailer URL', function () {
	var testCases = [
		{
			url: 'http://vignette.wikia-dev.com/thelastofus/9/99/Robert.png',
			expectedOutput: true
		},
		{
			url: 'http://vignette.wikia.nocookie.net/muppet/d/d9/Jim-and-jim.jpg/revision/latest' +
			'/top-crop/width/500/height/200?cb=20130614225714',
			expectedOutput: true
		},
		{
			url: 'http://vignette.wikia.nocookie.net/common/avatars/7/7c/1271044.png/revision/latest',
			expectedOutput: true
		},
		{
			url: 'http://static.igor.wikia-dev.com/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			expectedOutput: false
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png' +
			'/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: false
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb0/common/avatars/thumb/7/7c/1271044.png/100px-1271044.png.jpg',
			expectedOutput: false
		}
	];

	testCases.forEach(function (testCase) {
		equal(Mercury.Modules.Thumbnailer.isThumbnailerUrl(testCase.url), testCase.expectedOutput);
	});
});

QUnit.test('Thumbnailer verifies legacy URL', function () {
	var testCases = [
		{
			url: 'http://static.igor.wikia-dev.com/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			expectedOutput: true
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png' +
			'/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: true
		},
		{
			url: 'http://vignette.wikia-dev.com/thelastofus/9/99/Robert.png',
			expectedOutput: false
		},
		{
			url: 'http://vignette.wikia.nocookie.net/muppet/d/d9/Jim-and-jim.jpg/revision/latest' +
			'/top-crop/width/500/height/200?cb=20130614225714',
			expectedOutput: false
		}
	];

	testCases.forEach(function (testCase) {
		equal(Mercury.Modules.Thumbnailer.isLegacyUrl(testCase.url), testCase.expectedOutput);
	});
});

QUnit.test('Thumbnailer clears thumb options from URL', function () {
	var testCases = [
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png' +
			'/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png' +
			'/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png'
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb0/common/avatars/thumb/7/7c/1271044.png/100px-1271044.png.jpg',
			expectedOutput: 'http://img3.wikia.nocookie.net/__cb0/common/avatars/thumb/7/7c/1271044.png'
		},
		{
			url: 'http://vignette.wikia.nocookie.net/muppet/d/d9/Jim-and-jim.jpg/revision/latest' +
			'/top-crop/width/500/height/200?cb=20130614225714',
			expectedOutput: 'http://vignette.wikia.nocookie.net/muppet/d/d9/Jim-and-jim.jpg/revision/latest'
		}
	];

	testCases.forEach(function (testCase) {
		equal(Mercury.Modules.Thumbnailer.clearThumbOptions(testCase.url), testCase.expectedOutput);
	});
});

QUnit.test('Thumbnailer parses legacy URL and returns list of parameters', function () {
	var testCases = [
		{
			url: 'http://static.igor.wikia-dev.com/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			expectedOutput: {
				domain: 'wikia-dev.com',
				cacheBuster: '20100311231730',
				wikiaBucket: 'muppet/images',
				imagePath: 'd/d9/Jim-and-jim.jpg'
			}
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png',
			expectedOutput: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '20140419225911',
				wikiaBucket: 'thelastofus/images',
				imagePath: 'e/ef/Ellie.png'
			}
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb0/common/avatars/thumb/7/7c/1271044.png',
			expectedOutput: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '0',
				wikiaBucket: 'common/avatars',
				imagePath: '7/7c/1271044.png'
			}
		}
	];

	testCases.forEach(function (testCase) {
		deepEqual(Mercury.Modules.Thumbnailer.getParametersFromLegacyUrl(testCase.url), testCase.expectedOutput);
	});
});

QUnit.test('Thumbnailer creates thumb URL from list of parameters', function () {
	var testCases = [
		{
			urlParameters: {
				domain: 'wikia-dev.com',
				cacheBuster: '20130614225714',
				wikiaBucket: 'thelastofus/images',
				imagePath: '9/99/Robert.png'
			},
			mode: Mercury.Modules.Thumbnailer.mode.topCrop,
			width: 500,
			height: 100,
			hasWebPSupport: true,
			expectedOutput: 'http://vignette.wikia-dev.com/thelastofus/images/9/99/Robert.png/revision/latest' +
			'/top-crop/width/500/height/100?cb=20130614225714&format=webp'
		},
		{
			urlParameters: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '20100311231730',
				wikiaBucket: 'muppet/images',
				imagePath: 'd/d9/Jim-and-jim.jpg'
			},
			mode: Mercury.Modules.Thumbnailer.mode.fixedAspectRatio,
			width: 300,
			height: 150,
			hasWebPSupport: false,
			expectedOutput: 'http://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
			'/fixed-aspect-ratio/width/300/height/150?cb=20100311231730'
		},
		{
			urlParameters: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '0',
				wikiaBucket: 'common/avatars',
				imagePath: '7/7c/1271044.png'
			},
			mode: Mercury.Modules.Thumbnailer.mode.zoomCrop,
			width: 100,
			height: 100,
			hasWebPSupport: false,
			expectedOutput: 'http://vignette.wikia.nocookie.net/common/avatars/7/7c/1271044.png/revision/latest' +
			'/zoom-crop/width/100/height/100?cb=0'
		}
	];

	testCases.forEach(function (testCase) {
		Mercury.Modules.Thumbnailer.hasWebPSupport = testCase.hasWebPSupport;
		equal(
			Mercury.Modules.Thumbnailer.createThumbnailUrl(
				testCase.urlParameters,
				testCase.mode,
				testCase.width,
				testCase.height
			),
			testCase.expectedOutput
		);
	});
});
