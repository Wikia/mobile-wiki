import {moduleFor, test} from 'ember-qunit';

const exampleBundleName = 'myTestAssetBundleName';

moduleFor('service:resource-loader', 'Unit | Service | resource loader', {
	unit: true
});


test('Resource has loaded status after load', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {
		data: {}
	};
	service.set('assets', assets);

	service.set('ajax', {
		request: () => {
			return {then: (callback) => {
				callback({css: []});
			}};
		}
	});

	service.load(exampleBundleName);

	assert.equal(service.assets[exampleBundleName].loaded, true);
});


test('Throw error on non existent bundle name', function (assert) {
	const service = this.subject();

	service.set('assets', {});

	assert.expect(1);
	assert.throws(() => {
		service.load(exampleBundleName);
	}, new Error('Requested asset not found on avialable assets list'), 'Expect an error with this message');
});


test('Throw error on data field in bundle config', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {};
	service.set('assets', assets);

	assert.expect(1);
	assert.throws(() => {
		service.load(exampleBundleName);
	}, new Error('Missing data property in requested asset'), 'Expect an error with this message');
});
