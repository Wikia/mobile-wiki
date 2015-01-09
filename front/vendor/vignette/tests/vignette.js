QUnit.module('Vignette tests');

QUnit.test('Vignette creates thumbnail URL', function () {
	var testCases = [
		{
			url: 'http://static.igor.wikia-dev.com/__cb20130614225714/thelastofus/images/9/99/Robert.png',
			mode: Vignette.mode.topCrop,
			width: 500,
			height: 200,
			hasWebPSupport: true,
			expectedOutput: 'http://vignette.wikia-dev.com/thelastofus/images/9/99/Robert.png/revision/latest' +
			'/top-crop/width/500/height/200?cb=20130614225714&format=webp'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			mode: Vignette.mode.fixedAspectRatio,
			width: 100,
			height: 100,
			hasWebPSupport: false,
			expectedOutput: 'http://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
			'/fixed-aspect-ratio/width/100/height/100?cb=20100311231730'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			mode: Vignette.mode.scaleToWidth,
			width: 100,
			height: 100,
			hasWebPSupport: false,
			expectedOutput: 'http://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
			'/scale-to-width/100?cb=20100311231730'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			mode: Vignette.mode.windowCrop,
			width: 100,
			height: 100,
			config: {
				xOffset1: 10,
				yOffset1: 10,
				xOffset2: 90,
				yOffset2: 90,
			},
			hasWebPSupport: false,
			expectedOutput: 'http://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
			'/window-crop/width/100/x-offset/10/y-offset/10/window-width/80/window-height/80?cb=20100311231730'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20100311231730/muppet/images/d/d9/Jim-and-jim.jpg',
			mode: Vignette.mode.windowCropFixed,
			width: 100,
			height: 100,
			config: {
				xOffset1: 10,
				yOffset1: 10,
				xOffset2: 90,
				yOffset2: 90,
			},
			hasWebPSupport: false,
			expectedOutput: 'http://vignette.wikia.nocookie.net/muppet/images/d/d9/Jim-and-jim.jpg/revision/latest' +
			'/window-crop-fixed/width/100/height/100/x-offset/10/y-offset/10/window-width/80/window-height/80' +
			'?cb=20100311231730'
		}
	];

	testCases.forEach(function (testCase) {
		Vignette.hasWebPSupport = testCase.hasWebPSupport;
		equal(
			Vignette.getThumbURL(testCase.url, testCase.mode, testCase.width, testCase.height, testCase.config),
			testCase.expectedOutput
		);
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
		equal(Vignette.isThumbnailerUrl(testCase.url), testCase.expectedOutput);
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
		equal(Vignette.isLegacyUrl(testCase.url), testCase.expectedOutput);
	});
});

QUnit.test('Thumbnailer clears thumb options from URL', function () {
	var testCases = [
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png' +
			'/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/e/ef/Ellie.png'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png' +
			'/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/e/ef/Ellie.png'
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb0/common/avatars/thumb/7/7c/1271044.png/100px-1271044.png.jpg',
			expectedOutput: 'http://img3.wikia.nocookie.net/__cb0/common/avatars/7/7c/1271044.png'
		},
		{
			url: 'http://vignette.wikia.nocookie.net/muppet/d/d9/Jim-and-jim.jpg/revision/latest' +
			'/top-crop/width/500/height/200?cb=20130614225714',
			expectedOutput: 'http://vignette.wikia.nocookie.net/muppet/d/d9/Jim-and-jim.jpg/revision/latest'
		}
	];

	testCases.forEach(function (testCase) {
		equal(Vignette.clearThumbOptions(testCase.url), testCase.expectedOutput);
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
				pathPrefix: '',
				imagePath: 'd/d9/Jim-and-jim.jpg'
			}
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20140419225911/thelastofus/images/thumb/e/ef/Ellie.png/200px-0%2C493%2C0%2C493-Ellie.png',
			expectedOutput: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '20140419225911',
				wikiaBucket: 'thelastofus/images',
				pathPrefix: '',
				imagePath: 'e/ef/Ellie.png'
			}
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb0/common/avatars/thumb/7/7c/1271044.png/100px-1271044.png.jpg',
			expectedOutput: {
				domain: 'wikia.nocookie.net',
				cacheBuster: '0',
				wikiaBucket: 'common/avatars',
				pathPrefix: '',
				imagePath: '7/7c/1271044.png'
			}
		}
	];

	testCases.forEach(function (testCase) {
		deepEqual(Vignette.getParametersFromLegacyUrl(testCase.url), testCase.expectedOutput);
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
			sizing: {
				mode: Vignette.mode.topCrop,
				width: 500,
				height: 100
			},
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
			sizing: {
				mode: Vignette.mode.fixedAspectRatio,
				width: 300,
				height: 150
			},
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
			sizing: {
				mode: Vignette.mode.zoomCrop,
				width: 100,
				height: 100
			},
			hasWebPSupport: false,
			expectedOutput: 'http://vignette.wikia.nocookie.net/common/avatars/7/7c/1271044.png/revision/latest' +
			'/zoom-crop/width/100/height/100?cb=0'
		}
	];

	testCases.forEach(function (testCase) {
		Vignette.hasWebPSupport = testCase.hasWebPSupport;
		equal(
			Vignette.createThumbnailUrl(
				testCase.urlParameters,
				testCase.sizing
			),
			testCase.expectedOutput
		);
	});
});

QUnit.test('Thumbnailer creates thumb URL for domains with prefixes', function () {
	var testCases = [
		{
			url: 'http://img2.wikia.nocookie.net/__cb20070118203456/memoryalpha/en/images/3/3e/Picard_on_holiday.jpg',
			mode: Vignette.mode.topCrop,
			width: 300,
			height: 300,
			expectedOutput: 'http://vignette.wikia.nocookie.net/memoryalpha/images/3/3e/Picard_on_holiday.jpg/revision/latest/top-crop/width/300/height/300?cb=20070118203456&path-prefix=en'
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb20140314170709/poznan/bg/images/4/49/IMG_0035.jpg',
			mode: Vignette.mode.zoomCrop,
			width: 150,
			height: 260,
			expectedOutput: 'http://vignette.wikia.nocookie.net/poznan/images/4/49/IMG_0035.jpg/revision/latest/zoom-crop/width/150/height/260?cb=20140314170709&path-prefix=bg'
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb20140314170709/p__/psychusa/images/a/ab/Upload2.jpg',
			mode: Vignette.mode.zoomCrop,
			width: 150,
			height: 260,
			expectedOutput: 'http://vignette.wikia.nocookie.net/p__/images/a/ab/Upload2.jpg/revision/latest/zoom-crop/width/150/height/260?cb=20140314170709&path-prefix=psychusa'
		},
		{
			url: 'http://img3.wikia.nocookie.net/__cb20140314170709/p__/pokemanshop/zh/images/1/11/002.jpg',
			mode: Vignette.mode.zoomCrop,
			width: 150,
			height: 260,
			expectedOutput: 'http://vignette.wikia.nocookie.net/p__/images/1/11/002.jpg/revision/latest/zoom-crop/width/150/height/260?cb=20140314170709&path-prefix=pokemanshop/zh'
		},
		{
			url: 'http://img2.wikia.nocookie.net/__cb20111213104442/swtor/ru/images/thumb/f/fe/Jediknightnew_icon.png/200px-43%2C286%2C0%2C121-Jediknightnew_icon.png',
			mode: Vignette.mode.zoomCrop,
			width: 150,
			height: 260,
			expectedOutput: 'http://vignette.wikia.nocookie.net/swtor/images/f/fe/Jediknightnew_icon.png/revision/latest/zoom-crop/width/150/height/260?cb=20111213104442&path-prefix=ru'
		}
	];
	testCases.forEach(function (testCase) {
		equal(
			Vignette.getThumbURL(
				testCase.url,
				testCase.mode,
				testCase.width,
				testCase.height
			),
			testCase.expectedOutput
		);
	});
});
