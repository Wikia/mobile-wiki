var Lab = require('lab'),
	sinon = require('sinon'),
	mockery = require('mockery'),
	server = require('../../www/server/app/app'),
	wreck = require('wreck'),
	lab = exports.lab = Lab.script(),
	code = require('code'),
	describe = lab.experiment,
	it = lab.it,
	beforeEach = lab.beforeEach,
	afterEach = lab.afterEach,
	expect = code.expect,
	mediawiki = require('../../www/server/app/lib/mediawiki'),
	wikiVariables = require('./fixtures/wiki-variables'),
	article = require('./fixtures/article');

describe('server', function () {
	var options = {
		url: '/wiki/Yoda',
		method: 'GET',
		headers: {
			'host': 'starwars.wikia.com',
		}
	};
	var wreckGetStub;

	beforeEach(function (done) {
		wreckGetStub = sinon.stub();
		mediawiki.__Rewire__('Wreck', {
			get: wreckGetStub
		});
		done();
	});

	afterEach(function (done) {
		mediawiki.__ResetDependency__('Wreck');
		done();
	});

	it('renders existing article', function (done) {
		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, article);
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, wikiVariables);

		server.inject(options, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(response.payload).to.include('<p>This is a test</p>');
			done();
		});
	});
});
