QUnit.module('auth/common/Geo)');

QUnit.test('Geo class is loaded', function () {
	ok(typeof window.Geo === 'function');
});

QUnit.test('Geo class exposes country getter', function () {
	ok(typeof new window.Geo().getCountry === 'function');
});

QUnit.test('Country getter returns string with a country name if Geo cookie is set', function () {
	document.cookie = 'Geo={%22city%22:%22FIXME%22%2C%22country%22:%22PL%22%2C%22continent%22:%22EU%22}';
	equal(new window.Geo().getCountry(), 'PL');
});
