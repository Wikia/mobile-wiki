define('mobile-wiki/tests/unit/utils/mediawiki-namespace-test', ['ember-qunit', 'qunit', 'mobile-wiki/utils/mediawiki-namespace'], function (_emberQunit, _qunit, _mediawikiNamespace) {
	'use strict';

	(0, _qunit.module)('Unit | Utility | mediawiki namespace', function () {
		(0, _emberQunit.test)('isContentNamespace', function (assert) {
			var testCases = [{
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
			}];

			testCases.forEach(function (_ref) {
				var contentNamespaces = _ref.contentNamespaces,
				    namespace = _ref.namespace,
				    expected = _ref.expected;

				assert.equal((0, _mediawikiNamespace.isContentNamespace)(namespace, contentNamespaces), expected);
			});
		});
	});
});