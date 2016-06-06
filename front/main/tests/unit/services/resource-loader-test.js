import {moduleFor, test} from 'ember-qunit';
import sinon from 'sinon';

const exampleBundleName = 'myTestAssetBundleName',
	typeCss = 'css';

moduleFor('service:resource-loader', 'Unit | Service | resource loader', {
	unit: true
});


test('CSS Resource has loaded status after load', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {
		data: {},
		type: typeCss
	};
	service.set('assets', assets);
	service.set('ajax', {
		request: () => {
			return {
				then: (callback) => {
					callback({css: []});
				}
			};
		}
	});

	service.load(exampleBundleName);

	assert.equal(service.assets[exampleBundleName].loaded, true);
});

test('Throw an error on non existent bundle name', function (assert) {
	const service = this.subject();

	service.set('assets', {});

	service.load(exampleBundleName).then(() => {
		assert.fail('Loading asset should fail here due to non existent bundle name');
	}, (error) => {
		assert.equal(error.message, 'Requested asset not found on avialable assets list');
	});
	assert.ok(true);
});

test('Don\'t load if resource already loaded', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {
		loaded: true
	};
	service.set('assets', assets);

	service.load(exampleBundleName).then((data) => {
		assert.equal(data, 'Asset already loaded');
	}, () => {
		assert.fail('Loading asset shouldn\'t fail here');
	});
	assert.ok(true);
});


test('Throw an error on type field missing in bundle config', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {};
	service.set('assets', assets);

	service.load(exampleBundleName).then(() => {
		assert.fail('Loading asset should fail here due to missing type');
	}, (error) => {
		assert.equal(error.message, 'Missing type property in requested asset');
	});
	assert.ok(true);
});


test('Throw an error on non existent loader for type', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {
		type: 'someRandomType'
	};
	service.set('assets', assets);

	service.load(exampleBundleName).then(() => {
		assert.fail('Loading asset should fail here due to non existent loader for type');
	}, (error) => {
		assert.equal(error.message, 'Loader for provided type doesn\'t exist');
	});
	assert.ok(true);
});


test('Throw an error on data field missing in bundle config', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {
		type: typeCss
	};
	service.set('assets', assets);

	service.load(exampleBundleName).then(() => {
		assert.fail('Loading asset should fail here due to non existent data field');
	}, (error) => {
		assert.equal(error.message, 'Missing data property in requested asset');
	});
	assert.ok(true);
});


test('Throw an error for corrupted data from API', function (assert) {
	const assets = {},
		service = this.subject(),
		spy = sinon.spy();

	assets[exampleBundleName] = {
		data: {},
		type: typeCss
	};
	service.set('assets', assets);
	service.set('appendTohHead', spy);

	service.set('ajax', {
		request: () => {
			return {
				then: (callback) => {
					try {
						return callback();
					} catch (e) {
						return Promise.reject(e);
					}
				}
			};
		}
	});

	service.load(exampleBundleName).then(() => {
		assert.fail('Loading asset should fail here due to corrupted data from mocked API');
	}, (error) => {
		assert.equal(error.message, 'Invalid assets data was returned from MediaWiki API');
	});
	assert.ok(true);
});
