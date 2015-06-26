QUnit.module('auth/common/Cookie)');

QUnit.test('Cookie class is loaded', function () {
	ok(typeof window.Cookie === 'function');
});

document.cookie = 'wikia_beacon_id=FM6JQNhtx5';
document.cookie = 'Geo={%22city%22:%22FIXME%22%2C%22country%22:%22PL%22%2C%22continent%22:%22EU%22}';
document.cookie = 'i18next=en';

QUnit.test('Cookie getter is extracting right value from a cookie', function () {
	equal(window.Cookie.get('Geo'), '{"city":"FIXME","country":"PL","continent":"EU"}');
	equal(window.Cookie.get('i18next'), 'en');
	equal(window.Cookie.get('wikia_beacon_id'), 'FM6JQNhtx5');
});

QUnit.test('Cookie getter is returning null if cookie value not found', function () {
	equal(window.Cookie.get('fakeCookieValue'), null);
});

QUnit.test('Cookie getter is extracting right value from the end of cookie string', function () {
	equal(window.Cookie.get('i18next'), 'en');
});

