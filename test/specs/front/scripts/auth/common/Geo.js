QUnit.module('auth/common/Geo)', {
	setup: function () {
		Cookie = {
			get: function () {
				return '{"city":"FIXME","country":"PL","continent":"EU"}';
			}
		};
	}
});

QUnit.test('Geo class is loaded', function () {
	ok(typeof window.Geo === 'function');
});

QUnit.test('Geo class exposes country getter', function () {
	ok(typeof new window.Geo().getCountry === 'function');
});

QUnit.test('Geo class exposes continent getter', function () {
	ok(typeof new window.Geo().getContinent === 'function');
});

QUnit.test('Country getter returns string with a country name if Geo cookie is set', function () {
	equal(new window.Geo().getCountry(), 'PL');
});

QUnit.test('Continent getter returns string with a continent name if Geo cookie is set', function () {
	equal(new window.Geo().getContinent(), 'EU');
});
