QUnit.module('auth/common/Geo)', function (hooks) {
	hooks.beforeEach(function () {
		var geoModule = {};
		mrequire.entries['auth/common/Geo'].callback(geoModule, {
			get: function () {
				return '{"city":"FIXME","country":"PL","continent":"EU"}';
			}
		});

		this.Geo = geoModule.default;
	});

	QUnit.test('Geo class is loaded', function (assert) {
		assert.ok(typeof this.Geo === 'function');
	});

	QUnit.test('Geo class exposes country getter', function (assert) {
		assert.ok(typeof new this.Geo().getCountry === 'function');
	});

	QUnit.test('Geo class exposes continent getter', function (assert) {
		assert.ok(typeof new this.Geo().getContinent === 'function');
	});

	QUnit.test('Country getter returns string with a country name if Geo cookie is set', function (assert) {
		assert.equal(new this.Geo().getCountry(), 'PL');
	});

	QUnit.test('Continent getter returns string with a continent name if Geo cookie is set', function (assert) {
		assert.equal(new this.Geo().getContinent(), 'EU');
	});

});
