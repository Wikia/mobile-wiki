define('mobile-wiki/tests/unit/utils/url-test', ['qunit', 'require', 'ember-qunit'], function (_qunit, _require2, _emberQunit) {
	'use strict';

	(0, _qunit.module)('Unit | Utility | url', function (hooks) {
		var extractEncodedTitle = void 0;

		hooks.beforeEach(function () {
			extractEncodedTitle = (0, _require2.default)('mobile-wiki/utils/url').extractEncodedTitle;
		});

		(0, _emberQunit.test)('test empty string', function (assert) {
			assert.equal(extractEncodedTitle(''), '');
		});

		(0, _emberQunit.test)('full url with params', function (assert) {
			assert.equal(extractEncodedTitle('http://test.wikia.com/wiki/File:Bug_Jungle_Tree_On_Ocean.png?useskin=mercury'), 'File:Bug_Jungle_Tree_On_Ocean.png?useskin=mercury');
		});

		(0, _emberQunit.test)('partial url', function (assert) {
			assert.equal(extractEncodedTitle('/wiki/Test article name'), 'Test article name');
		});

		(0, _emberQunit.test)('full url no params', function (assert) {
			assert.equal(extractEncodedTitle('http://test.wikia.com/wiki/Test'), 'Test');
		});

		(0, _emberQunit.test)('url with no wiki', function (assert) {
			assert.equal(extractEncodedTitle('http://test.wikia.com/Test'), 'Test');
		});

		(0, _emberQunit.test)('full url with many wikis', function (assert) {
			assert.equal(extractEncodedTitle('http://test.wikia.com/wiki/Wiki/wiki/wiki/wiki'), 'Wiki/wiki/wiki/wiki');
		});

		(0, _emberQunit.test)('partial url with many wikis', function (assert) {
			assert.equal(extractEncodedTitle('/wiki/Wiki/wiki/wiki/wiki'), 'Wiki/wiki/wiki/wiki');
		});

		(0, _emberQunit.test)('only title text', function (assert) {
			assert.equal(extractEncodedTitle('Title'), 'Title');
		});

		(0, _emberQunit.test)('only title', function (assert) {
			assert.equal(extractEncodedTitle('/Title'), 'Title');
		});

		(0, _emberQunit.test)('Wiki as title', function (assert) {
			assert.equal(extractEncodedTitle('/Wiki'), 'Wiki');
		});

		(0, _emberQunit.test)('wiki as title', function (assert) {
			assert.equal(extractEncodedTitle('/wiki'), 'wiki');
		});
	});
});