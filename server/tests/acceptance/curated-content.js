var Lab = require('lab'),
	sinon = require('sinon'),
	code = require('code'),
	lab = exports.lab = Lab.script(),
	describe = lab.experiment,
	it = lab.it,
	beforeEach = lab.beforeEach,
	afterEach = lab.afterEach,
	expect = code.expect,
	clone = require('../utils/clone'),
	server = require('../../../www/server/app/app'),
	mediawiki = require('../../../www/server/app/lib/mediawiki'),
	wikiVariables = require('../fixtures/wiki-variables'),
	footer = require('../fixtures/design-system/global-footer'),
	mainPageDetailsAndContext = require('../fixtures/main-page-details-and-context');

describe('curated-content', function () {
	var requestParams = {
			url: '/main/section/Test',
			method: 'GET',
			headers: {
				host: 'starwars.wikia.com'
			}
		},
		wreckGetStub = sinon.stub();

	beforeEach(function (done) {
		mediawiki.__Rewire__('Wreck', {
			get: wreckGetStub
		});
		done();
	});

	afterEach(function (done) {
		wreckGetStub.reset();
		mediawiki.__ResetDependency__('Wreck');
		done();
	});
	it('renders application when all server requests succeed', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(mainPageDetailsAndContext));
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(response.payload).to.include('M.prop(\'mainPageData\'');
			done();
		});
	});

	it('renders error page when request for wiki variables fails', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(mainPageDetailsAndContext));
		wreckGetStub.onCall(1).yields(null, {statusCode: 503}, {});

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(503);
			expect(response.payload).to.include('<h1>Error</h1>');
			done();
		});
	});

	it(
		'renders page without ads context and meta data when request for main page details and context fails',
		function (done) {
			wreckGetStub.onCall(0).yields(null, {statusCode: 503}, {});
			wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));

			server.inject(requestParams, function (response) {
				expect(response.statusCode).to.equal(200);
				expect(response.payload).to.not.include('M.prop(\'mainPageData\'');
				done();
			});
		}
	);

	it('redirects when requested wiki is redirected', function (done) {
		mediawiki.__Rewire__('Wreck', {
			get: function (url, options, callback) {
				if (url.indexOf('getWikiVariables') > -1) {
					options.redirected(null, 'http://google.com/');

					callback(null, {statusCode: 200}, 'not a valid wikia');
				} else {
					callback(null, {statusCode: 200}, clone(mainPageDetailsAndContext));
				}
			}
		});

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(302);
			expect(response.headers.location).to.equal(
				'http://google.com/'
			);
			done();
		});

	});

	it('redirects to primary URL when requested wiki by alias host', function (done) {
		var requestParamsWithAliasHost = clone(requestParams);

		requestParamsWithAliasHost.headers.host = 'starwars-alias.wikia.com';

		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(mainPageDetailsAndContext));
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParamsWithAliasHost, function (response) {
			expect(response.statusCode).to.equal(301);
			expect(response.headers.location).to.equal(
				'http://starwars.wikia.com/main/section/Test'
			);
			done();
		});
	});
});
