import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';
import {getDomain} from '../../../app/utils/domain';
import sinon from 'sinon';

const originalTrackClick = require.entries['main/mixins/track-click'];

require.entries['main/mixins/track-click'].callback = () => {
	return Ember.Mixin.create({
		actions: {
			trackClick: Ember.K
		}
	});
};

moduleForComponent('wikia-footer', 'Unit | Component | wikia-footer', {
	unit: true,
	beforeEach() {
		sinon.spy(Ember.$, 'cookie');
	},
	afterEach() {
		Ember.$.cookie.restore();
	}
});

require.entries['main/mixins/track-click'] = originalTrackClick;

test('checkLinkForOasisSkinOverwrite returns true if skin is overwritten to oasis', function (assert) {
	const testUrls = [
			'http://muppet.wikia.com/wiki/Kermit?useskin=oasis',
			'http://muppet.wikia.com/wiki/Kermit?aaaa=bbb&useskin=oasis',
			'http://muppet.wikia.com/wiki/Kermit?useskin=oasis&aaaa=bbb'
		],
		component = this.subject();

	testUrls.forEach((url) => {
		assert.ok(component.checkLinkForOasisSkinOverwrite(url), `Error for ${url}`);
	});
});

test('checkLinkForOasisSkinOverwrite returns false if skin is not ovewritten to oasis', function (assert) {
	const component = this.subject();

	assert.notOk(
		component.checkLinkForOasisSkinOverwrite('http://muppet.wikia.com/wiki/Kermit?useskin=monobook')
	);
});

test('sets cookie if skin is overwritten to oasis', function (assert) {
	const component = this.subject();

	component.set('checkLinkForOasisSkinOverwrite', () => true);
	component.send('handleFooterLinkClick', 'test', 'test');

	assert.ok(Ember.$.cookie.calledOnce);
	assert.ok(Ember.$.cookie.calledWith('useskin', 'oasis', {
		path: '/',
		domain: getDomain()
	}));
});

test('doesn\'t set cookie if skin is not overwritten to oasis', function (assert) {
	const component = this.subject();

	component.set('checkLinkForOasisSkinOverwrite', () => false);
	component.send('handleFooterLinkClick', 'test', 'test');

	assert.notOk(Ember.$.cookie.called);
});
