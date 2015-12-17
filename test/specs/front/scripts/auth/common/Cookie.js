QUnit.module('auth/common/Cookie', function (hooks) {
	// TODO: replace this with a class method to delete a cookie
	function delete_cookie(name) {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}

	hooks.beforeEach(function () {
		document.cookie = 'wikia_beacon_id=FM6JQNhtx5';
		document.cookie = 'Geo={%22city%22:%22FIXME%22%2C%22country%22:%22PL%22%2C%22continent%22:%22EU%22}';
		document.cookie = 'i18next=en';
	});

	hooks.afterEach(function () {
		delete_cookie('wikia_beacon_id');
		delete_cookie('Geo');
		delete_cookie('i18next');
	});

	QUnit.test('Cookie class is loaded', function (assert) {
		assert.ok(typeof mrequire('auth/common/Cookie').default === 'function');
	});

	QUnit.test('Cookie getter is extracting right value from a cookie', function (assert) {
		var Cookie = mrequire('auth/common/Cookie').default;

		assert.equal(Cookie.get('Geo'), '{"city":"FIXME","country":"PL","continent":"EU"}');
		assert.equal(Cookie.get('i18next'), 'en');
		assert.equal(Cookie.get('wikia_beacon_id'), 'FM6JQNhtx5');
	});

	QUnit.test('Cookie getter is returning null if cookie value not found', function (assert) {
		var Cookie = mrequire('auth/common/Cookie').default;

		assert.equal(Cookie.get('fakeCookieValue'), null);
	});

	QUnit.test('Cookie getter is extracting right value from the end of cookie string', function (assert) {
		var Cookie = mrequire('auth/common/Cookie').default;

		assert.equal(Cookie.get('i18next'), 'en');
	});


});
