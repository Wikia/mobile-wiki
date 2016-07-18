var Lab = require('lab'),
	sinon = require('sinon'),
	code = require('code'),
	lab = exports.lab = Lab.script(),
	describe = lab.experiment,
	it = lab.it,
	before = lab.before,
	after = lab.after,
	afterEach = lab.afterEach,
	expect = code.expect,
	clone = require('../utils/clone'),
	server = require('../../../www/server/app/app'),
	mediawiki = require('../../../www/server/app/lib/mediawiki'),
	wikiVariables = require('../fixtures/wiki-variables'),
	footer = require('../fixtures/design-system/footer'),
	article = require('../fixtures/article'),
	curatedMainPage = require('../fixtures/curated-main-page');

describe('wiki-page', function () {
	var requestParams = {
			url: '/wiki/Yoda',
			method: 'GET',
			headers: {
				host: 'starwars.wikia.com'
			}
		},
		requestParamsWithoutTitle = {
			url: '/wiki/',
			method: 'GET',
			headers: {
				host: 'starwars.wikia.com'
			}
		},
		wreckGetStub = sinon.stub();

	before(function (done) {
		mediawiki.__Rewire__('Wreck', {
			get: wreckGetStub
		});
		done();
	});

	afterEach(function (done) {
		wreckGetStub.reset();
		done();
	});

	after(function (done) {
		mediawiki.__ResetDependency__('Wreck');
		done();
	});

	it('renders existing article', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(article));
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(response.payload).to.include('<p>This is a test</p>');
			done();
		});
	});

	it('renders curated main page', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(curatedMainPage));
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(response.payload).to.include(
				'M.provide(\'article\', {"data":{"isMainPage":true,"ns":0,"mainPageData":{"curatedContent"'
			);
			done();
		});
	});

	it('renders error page when request for wiki variables fails (payload is an empty object)', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(article));
		wreckGetStub.onCall(1).yields(null, {statusCode: 503}, {});
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(503);
			expect(response.payload).to.include('<h1>Error</h1>');
			done();
		});
	});

	it('renders error page when request for wiki variables fails (payload is an empty string)', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(article));
		wreckGetStub.onCall(1).yields(null, {statusCode: 503}, '');
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(503);
			expect(response.payload).to.include('<h1>Error</h1>');
			done();
		});
	});

	it('renders error page when request for wiki variables fails (payload is a string)', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(article));
		wreckGetStub.onCall(1).yields(null, {statusCode: 503}, 'error');
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(503);
			expect(response.payload).to.include('<h1>Error</h1>');
			done();
		});
	});

	it('redirects to community wikia when requested wiki does not exist', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(article));
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, 'not a valid wikia');
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(302);
			expect(response.headers.location).to.equal(
				'http://community.wikia.com/wiki/Community_Central:Not_a_valid_Wikia'
			);
			done();
		});
	});

	it('redirects to primary URL when requested wiki by alias host', function (done) {
		var requestParamsWithAliasHost = clone(requestParams);

		requestParamsWithAliasHost.headers.host = 'starwars-alias.wikia.com';

		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(article));
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParamsWithAliasHost, function (response) {
			expect(response.statusCode).to.equal(301);
			expect(response.headers.location).to.equal(
				'http://starwars.wikia.com/wiki/Yoda'
			);
			done();
		});
	});

	it('renders page with correct M.prop when request for article returns 404', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 404}, {});
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(404);

			// Ember displays 404 page based on that
			expect(response.payload).to.include('M.prop(\'exception\', {"code":404}, true);');
			done();
		});
	});

	it('renders page with correct M.prop when request for article returns 503', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 503}, {});
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(503);

			// Ember displays error page with reload button based on that
			expect(response.payload).to.include('M.prop(\'exception\', {"code":503}, true);');
			done();
		});
	});

	it('redirects to main page on /wiki/', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(wikiVariables));

		server.inject(requestParamsWithoutTitle, function (response) {
			expect(response.statusCode).to.equal(302);
			expect(response.headers.location).to.equal(
				'/wiki/Main_Page'
			);
			done();
		});
	});

	it('shows error page when wiki variables request fails on /wiki/', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 503}, {});

		server.inject(requestParamsWithoutTitle, function (response) {
			expect(response.statusCode).to.equal(503);
			expect(response.payload).to.include('<h1>Error</h1>');
			done();
		});
	});

	it('redirects to community wikia on /wiki/ when requested wiki does not exist', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, 'not a valid wikia');

		server.inject(requestParamsWithoutTitle, function (response) {
			expect(response.statusCode).to.equal(302);
			expect(response.headers.location).to.equal(
				'http://community.wikia.com/wiki/Community_Central:Not_a_valid_Wikia'
			);
			done();
		});
	});

	it('renders article with custom namespace', function (done) {
		var requestParamsWithCustomNamespace = clone(requestParams),
			articleWithCustomNamespace = clone(article),
			wikiVariablesWithCustomNamespace = clone(wikiVariables);

		requestParamsWithCustomNamespace.url = '/wiki/Portal:Whatever';
		articleWithCustomNamespace.data.ns = 112;
		wikiVariablesWithCustomNamespace.data.contentNamespaces = [0, 112];

		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, articleWithCustomNamespace);
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, wikiVariablesWithCustomNamespace);
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParamsWithCustomNamespace, function (response) {
			expect(response.statusCode).to.equal(200);

			// required for internal tracking
			expect(response.payload).to.include('M.prop(\'mediaWikiNamespace\', \'112\')');

			// required for preload to work
			expect(response.payload).to.include('M.prop(\'articleContentPreloadedInDOM\', true, true)');
			expect(response.payload).to.include('M.provide(\'article\', {"data":{"isMainPage":false,"ns":112');
			expect(response.payload).to.include('<p>This is a test</p>');
			done();
		});
	});

	it('renders curated main page with custom namespace', function (done) {
		var curatedMainPageWithCustomNamespace = clone(curatedMainPage);

		curatedMainPageWithCustomNamespace.data.ns = 999;

		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, curatedMainPageWithCustomNamespace);
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(response.payload).to.include(
				'M.provide(\'article\', {"data":{"isMainPage":true,"ns":999,"mainPageData":{"curatedContent"'
			);
			done();
		});
	});

	it('redirects to oasis on unsupported namespace', function (done) {
		var requestParamsWithQueryInUrl = clone(requestParams),
			pageWithUnsupportedNamespace = clone(article);

		requestParamsWithQueryInUrl.url = '/wiki/Yoda?test=1';
		pageWithUnsupportedNamespace.data.ns = 999;

		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, pageWithUnsupportedNamespace);
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParamsWithQueryInUrl, function (response) {
			expect(response.statusCode).to.equal(302);
			expect(response.headers.location).to.equal(
				'/wiki/Yoda?test=1&useskin=oasis'
			);

			done();
		});
	});
});
