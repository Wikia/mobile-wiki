import {test} from 'ember-qunit';
import {module} from 'qunit';
import {isContentNamespace} from 'mobile-wiki/utils/mediawiki-namespace';
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
			assert.equal(isContentNamespace(namespace, contentNamespaces), expected);
		});
	});
});
