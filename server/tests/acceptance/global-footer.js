var Lab = require('lab'),
	sinon = require('sinon'),
	code = require('code'),
	lab = exports.lab = Lab.script(),
	describe = lab.experiment,
	it = lab.it,
	expect = code.expect,
	fs = require('fs'),
	before = lab.before,
	after = lab.after,
	afterEach = lab.afterEach,
	clone = require('../utils/clone'),
	server = require('../../../www/server/app/app'),
	mediawiki = require('../../../www/server/app/lib/mediawiki'),
	article = require('../fixtures/article'),
	wikiVariables = require('../fixtures/wiki-variables'),
	footer = require('../fixtures/design-system/global-footer'),
	jsdom = require('jsdom');

function sanitizeHTML(rawHTML) {
	return rawHTML.replace(/>\s+</g, '><')
		.replace(/>\s+(\w|\.)/g, '>$1')
		.replace(/(\w|\.)\s+<\//g, '$1</')
		.replace(/(\r\n|\n|\r)/gm, '');
}

describe('global-footer', function () {
	var requestParams = {
			url: '/wiki/Yoda',
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

	it('compare global footer with its baseline', function (done) {
		var footerMarkupBaseline = sanitizeHTML(
			fs.readFileSync(__dirname + '/../fixtures/design-system/global-footer.html', 'utf-8')
		);

		wreckGetStub.onCall(0).yields(null, {statusCode: 200}, clone(article));
		wreckGetStub.onCall(1).yields(null, {statusCode: 200}, clone(wikiVariables));
		wreckGetStub.onCall(2).yields(null, {statusCode: 200}, clone(footer));

		server.inject(requestParams, function (response) {
			jsdom.env(response.payload, function (errors, window) {
				var footerHTML = window.document.getElementsByClassName('wds-global-footer')[0],
					footerWrapper = window.document.createElement('div'),
					footerMarkup;

				if (footerHTML) {
					footerWrapper.appendChild(footerHTML.cloneNode(true));
				}

				footerMarkup = sanitizeHTML(footerWrapper.innerHTML);
				expect(footerMarkup).to.equal(footerMarkupBaseline);

				done();
			});
		});
	});
});
