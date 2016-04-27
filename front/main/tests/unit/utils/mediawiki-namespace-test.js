import {test} from 'ember-qunit';
import {module} from 'qunit';
import {isContentNamespace} from 'main/utils/mediawiki-namespace';
import Ember from 'ember';
import sinon from 'sinon';

module('Unit | Utility | mediawiki namespace', () => {
	test('isContentNamespace', (assert) => {
		const testCases = [
			{
				contentNamespaces: [0, 112],
				namespace: 112,
				expected: true
			}, {
				contentNamespaces: [0, 112],
				namespace: 14,
				expected: false
			}, {
				contentNamespaces: [0, '112'],
				namespace: 112,
				expected: true
			}, {
				contentNamespaces: [0, 112],
				namespace: 0,
				expected: true
			}
		];

		testCases.forEach(({contentNamespaces, namespace, expected}) => {
			sinon.stub(Ember, 'getWithDefault').withArgs(Mercury, 'wiki.contentNamespaces', []).returns(contentNamespaces);

			assert.equal(isContentNamespace(namespace), expected);

			Ember.getWithDefault.restore();
		});
	});
});
