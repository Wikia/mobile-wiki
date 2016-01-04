import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

moduleForComponent('wikia-footer', 'Unit | Component | wikia footer', {
	unit: true
});

test('checkLinkForOasisSkinOverwrite returns true if skin is overwritten to oasis', function (assert) {
	var component = this.subject(),
		testUrls = [
			'http://muppet.wikia.com/wiki/Kermit?useskin=oasis',
			'http://muppet.wikia.com/wiki/Kermit?aaaa=bbb&useskin=oasis',
			'http://muppet.wikia.com/wiki/Kermit?useskin=oasis&aaaa=bbb'
		];

	testUrls.forEach(function (url) {
		assert.strictEqual(component.checkLinkForOasisSkinOverwrite(url), true);
	});
});

test('checkLinkForOasisSkinOverwrite returns false if skin is not ovewritten to oasis', function (assert) {
	var component = this.subject();

	assert.strictEqual(
		component.checkLinkForOasisSkinOverwrite('http://muppet.wikia.com/wiki/Kermit?useskin=monobook'), false
	);
});

test('sets cookie if skin is overwritten to oasis', function (assert) {
	var component = this.subject();

	component.checkLinkForOasisSkinOverwrite = function () {return true};
	sinon.spy(Ember.$, 'cookie');
	component.send('handleFooterLinkClick', 'test', 'test');

	assert.ok(Ember.$.cookie.calledOnce);
	assert.ok(Ember.$.cookie.calledWith('useskin', 'oasis', {path: '/', domain: require('common/utils/domain').getDomain()}));

	Ember.$.cookie.restore();
});

test('doesn\'t set cookie if skin is not overwritten to oasis', function (assert) {
	var component = this.subject();

	component.checkLinkForOasisSkinOverwrite = function () {return false};
	sinon.spy(Ember.$, 'cookie');
	component.send('handleFooterLinkClick', 'test', 'test');

	assert.notOk(Ember.$.cookie.called);

	Ember.$.cookie.restore();
});
