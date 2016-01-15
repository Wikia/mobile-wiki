QUnit.module('main/utils/truncate', function (hooks) {
	var truncate;

	hooks.beforeEach(function () {
		truncate = mrequire('main/utils/truncate').default;
	});

	QUnit.test('Truncate helper is exported', function () {
		ok(truncate);
	});

	QUnit.test('short text', function () {
		equal(truncate('short text'), 'short text');
	});

	QUnit.test('long text', function () {
		equal(truncate('long text, please truncate', 20), 'long text, please\u2026');
	});

	QUnit.test('long text, default truncation', function () {
		equal(truncate('long text, please truncate at the end dasdasdasdasdsadsadsa'),
			'long text, please truncate at the end\u2026');
	});

	QUnit.test('long text, truncation after whitespace', function () {
		equal(truncate('trala laaa p\tadasd\n', 16), 'trala laaa p\u2026');
	});

	QUnit.test('short text, truncation after newline char', function () {
		equal(truncate('123\n5678', 6), '123\u2026');
	});

	QUnit.test('long text, default truncation', function () {
		equal(truncate('long text, please truncate at the end blablabla blablabla'),
			'long text, please truncate at the end blablabla\u2026');
	});

	QUnit.test('number instead of text', function () {
		equal(truncate(20), null);
	});
});
