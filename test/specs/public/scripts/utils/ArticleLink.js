test('getLinkInfo tests', function () {
	var li = W.getLinkInfo;

	var httpTests = [
		'http://asdfjklasdf.asdf',
		'https://asdfjklasdf.asdf',
		'http://lastofus.wikia.com',
		'https://www.google.com/?search=goats'
	];

	var hashTests = [

	];

	expect(httpTests.length * 2);
	httpTests.forEach(function (test, index, arr) {
		// basepath, title, hash should not be used
		var res = li('basepath', 'title', '#hash', test);
		equal(res.article, null, 'article should be null');
		equal(res.url, test, 'url should be the same as input');
	});
});
