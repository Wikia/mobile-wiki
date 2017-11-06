define('mobile-wiki/tests/unit/utils/truncate-test', ['qunit', 'require', 'ember-qunit'], function (_qunit, _require2, _emberQunit) {
	'use strict';

	(0, _qunit.module)('Unit | Utility | truncate', function (hooks) {
		var truncate = void 0;

		hooks.beforeEach(function () {
			truncate = (0, _require2.default)('mobile-wiki/utils/truncate').default;
		});

		(0, _emberQunit.test)('Truncate helper is exported', function (assert) {
			assert.ok(truncate);
		});

		(0, _emberQunit.test)('short text', function (assert) {
			assert.equal(truncate('short text'), 'short text');
		});

		(0, _emberQunit.test)('long text', function (assert) {
			assert.equal(truncate('long text, please truncate', 20), 'long text, please\u2026');
		});

		(0, _emberQunit.test)('long text, default truncation', function (assert) {
			assert.equal(truncate('long text, please truncate at the end dasdasdasdasdsadsadsa'), 'long text, please truncate at the end\u2026');
		});

		(0, _emberQunit.test)('long text, truncation after whitespace', function (assert) {
			assert.equal(truncate('trala laaa p\tadasd\n', 16), 'trala laaa p\u2026');
		});

		(0, _emberQunit.test)('long text, whitespace in place of truncation', function (assert) {
			assert.equal(truncate('123456789 long text here', 10), '123456789\u2026');
		});

		(0, _emberQunit.test)('short text, truncation after newline char', function (assert) {
			assert.equal(truncate('123\n5678', 6), '123\u2026');
		});

		(0, _emberQunit.test)('long text, default truncation', function (assert) {
			assert.equal(truncate('long text, please truncate at the end blablabla blablabla'), 'long text, please truncate at the end blablabla\u2026');
		});

		(0, _emberQunit.test)('number instead of text', function (assert) {
			assert.equal(truncate(20), null);
		});
	});
});