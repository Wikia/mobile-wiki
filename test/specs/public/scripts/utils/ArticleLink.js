module('getLinkInfo tests', {
	setup: function () {
		li = W.getLinkInfo;
	},
	teardown: function () {
	}
});

test('getLinkInfo test external paths', function () {
	// These tests need to not contain the current base path (in the test, that's http://localhost:9876)
	var tests = [
		'https://www.google.com/?search=goats',
		'http://www.ign.com/skrup',
		'yahoo.com#yrddd'
	];
	expect(tests.length * 2);
	tests.forEach(function (link) {
		var match = link.match(/^.*(#.*)$/);
		// setting hash to mimic the way ArticleView calls this function
		var hash = match ? match[1] : '';
		var info = li('http://lastofus.wikia.com', 'Ellie', hash, link);
		equal(info.article, null, 'on external link, article should always be null');
		equal(info.url, link, 'on external link output url should always be the same as input');
	});
});

test('getLinkInfo special links', function () {
	var tests = [
		'Special:',
		'Special:something',
		'File:img.jpg',
		'Project_Talk:blerg'
	];
	expect(tests.length * 2);
	tests.forEach(function (test) {
		var res = li('http://lastofus.wikia.com', 'article', '', window.location.origin + '/wiki/' + test);
		equal(res.article, null, 'for special links article should be null');
		equal(res.url, 'http://lastofus.wikia.com/wiki/' + test, 'special links should link back to main app');
	});
});

test('getLinkInfo article links', function () {
	// These tests must be in the form current base path + /wiki/name
	var tests = [
		'Ellie',
		'Joel',
		'David_Michael_Vigil'
	];
	expect(tests.length * 2);
	tests.forEach(function (test) {
		// 'article' is distinct from the tests, we're transtioning from a different page
		var res = li('http://lastofus.wikia.com', 'article', '', window.location.origin + '/wiki/' + test);
		equal(res.article, test, 'article should match article passed in');
		equal(res.url, null, 'url should be null');
	});
});

test('getLinkInfo jump links', function () {
	expect(2);
	var res = li('http://lastofus.wikia.com', 'article', '#hash', window.location.origin + '/wiki/article#hash');
	equal(res.article, null, 'for jump links article should be null');
	equal(res.url, '#hash', 'for jump links the url should just be the jump link');
});
