'use strict';

moduleForComponent('wikia-footer', 'WikiaFooterComponent', {
	unit: true
});

test('checkLinkForOasisSkinOverwrite returns true if skin is overwritten to oasis', function () {
	var component = this.subject(),
		testUrls = [
			'http://muppet.wikia.com/wiki/Kermit?useskin=oasis',
			'http://muppet.wikia.com/wiki/Kermit?aaaa=bbb&useskin=oasis',
			'http://muppet.wikia.com/wiki/Kermit?useskin=oasis&aaaa=bbb'
		];

	testUrls.forEach(function (url) {
		strictEqual(component.checkLinkForOasisSkinOverwrite(url), true);
	});
});

test('checkLinkForOasisSkinOverwrite returns false if skin is not ovewritten to oasis', function () {
	var component = this.subject();

	strictEqual(
		component.checkLinkForOasisSkinOverwrite('http://muppet.wikia.com/wiki/Kermit?useskin=monobook'), false
	);
});

test('sets cookie if skin is overwritten to oasis', function () {
	var component = this.subject();

	component.checkLinkForOasisSkinOverwrite = function () {return true};
	sinon.spy(Em.$, 'cookie');
	component.send('handleFooterLinkClick', 'test', 'test');

	ok(Em.$.cookie.calledOnce);
	ok(Em.$.cookie.calledWith('useskin', 'oasis', {path: '/', domain: mrequire('mercury/utils/domain').getDomain()}));

	Em.$.cookie.restore();
});

test('doesn\'t set cookie if skin is not overwritten to oasis', function () {
	var component = this.subject();

	component.checkLinkForOasisSkinOverwrite = function () {return false};
	sinon.spy(Em.$, 'cookie');
	component.send('handleFooterLinkClick', 'test', 'test');

	notOk(Em.$.cookie.called);

	Em.$.cookie.restore();
});
