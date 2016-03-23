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
	server = require('../../../www/server/app/app'),
	mediawiki = require('../../../www/server/app/lib/mediawiki'),
	wikiVariables = require('../fixtures/wiki-variables'),
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

	it('renders application when all server requests succeed', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, mainPageDetailsAndContext);
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, wikiVariables);

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(response.payload).to.include('M.prop(\'mainPageData\'');
			done();
		});
	});

	it('renders error page when request for wiki variables fails', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, mainPageDetailsAndContext);
		wreckGetStub.onCall(1).yields(null, {statusCode: 503}, wikiVariables);

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
			wreckGetStub.onCall(1).yields(null, {statusCode: 200}, wikiVariables);

			server.inject(requestParams, function (response) {
				expect(response.statusCode).to.equal(200);
				expect(response.payload).to.not.include('M.prop(\'mainPageData\'');
				done();
			});
		}
	);

	it('redirects to community wikia when requested wiki does not exist', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, mainPageDetailsAndContext);
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, 'not a valid wikia');

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(302);
			expect(response.headers.location).to.equal(
				'http://community.wikia.com/wiki/Community_Central:Not_a_valid_Wikia'
			);
			done();
		});
	});

	it('redirects to primary URL when requested wiki by alias host', function (done) {
		var requestParamsWithAliasHost = {
			url: '/main/section/Test',
			method: 'GET',
			headers: {
				host: 'www.starwars.wikia.com',
			}
		};

		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, mainPageDetailsAndContext);
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, wikiVariables);

		server.inject(requestParamsWithAliasHost, function (response) {
			expect(response.statusCode).to.equal(301);
			expect(response.headers.location).to.equal(
				'http://starwars.wikia.com/main/section/Test'
			);
			done();
		});
	});
});
