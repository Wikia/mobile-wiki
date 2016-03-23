var Lab = require('lab'),
	sinon = require('sinon'),
	server = require('../../../www/server/app/app'),
	lab = exports.lab = Lab.script(),
	code = require('code'),
	describe = lab.experiment,
	it = lab.it,
	before = lab.before,
	after = lab.after,
	afterEach = lab.afterEach,
	expect = code.expect,
	mediawiki = require('../../../www/server/app/lib/mediawiki'),
	wikiVariables = require('../fixtures/wiki-variables'),
	article = require('../fixtures/article');

describe('wiki-page', function () {
	var requestParams = {
			url: '/wiki/Yoda',
			method: 'GET',
			headers: {
				host: 'starwars.wikia.com',
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
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, article);
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, wikiVariables);

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(response.payload).to.include('<p>This is a test</p>');
			done();
		});
	});

	it('renders error page when request for wiki variables fails', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, article);
		wreckGetStub.onCall(1).yields(null, {statusCode: 503}, {});

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(503);
			expect(response.payload).to.include('<h1>Error</h1>');
			done();
		});
	});

	it('redirects to community wikia when requested wiki does not exist', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, article);
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, 'not a valid wikia');

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(302);
			expect(response.headers.location).to.equal(
				'http://community.wikia.com/wiki/Community_Central:Not_a_valid_Wikia'
			);
			done();
		});
	});
});
