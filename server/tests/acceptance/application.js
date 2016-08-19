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
	footer = require('../fixtures/design-system/global-footer');

describe('application', function () {
	var requestParams = {
			url: '/recent-wiki-activity',
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

	it('renders application when request for wiki variables succeeds', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('renders error page when request for wiki variables fails', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 503}, {});

		server.inject(requestParams, function (response) {
			expect(response.statusCode).to.equal(503);
			expect(response.payload).to.include('<h1>Error</h1>');
			done();
		});
	});

	it('redirects to community wikia when requested wiki does not exist', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, 'not a valid wikia');

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

		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(wikiVariables));

		server.inject(requestParamsWithAliasHost, function (response) {
			expect(response.statusCode).to.equal(301);
			expect(response.headers.location).to.equal(
				'http://starwars.wikia.com/recent-wiki-activity'
			);
			done();
		});
	});
});
