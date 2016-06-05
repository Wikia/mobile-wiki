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

	assert.expect(1);
	assert.throws(() => {
		service.load(exampleBundleName);
	}, new Error('Requested asset not found on avialable assets list'));
});

test('Don\'t load if resource already loaded', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {
		loaded: true
	};
	service.set('assets', assets);

	assert.equal(service.load(exampleBundleName), true);
});


test('Throw an error on type field missing in bundle config', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {};
	service.set('assets', assets);

	assert.expect(1);
	assert.throws(() => {
		service.load(exampleBundleName);
	}, new Error('Missing type property in requested asset'));
});


test('Throw an error on non existent loader for type', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {
		type: 'someRandomType'
	};
	service.set('assets', assets);

	assert.expect(1);
	assert.throws(() => {
		service.load(exampleBundleName);
	}, new Error('Loader for provided type doesn\'t exist'));
});


test('Throw an error on data field missing in bundle config', function (assert) {
	const assets = {},
		service = this.subject();

	assets[exampleBundleName] = {
		type: typeCss
	};
	service.set('assets', assets);

	assert.expect(1);
	assert.throws(() => {
		service.load(exampleBundleName);
	}, new Error('Missing data property in requested asset'));
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
					callback();
				}
			};
		}
	});

	assert.expect(1);
	assert.throws(() => {
		service.load(exampleBundleName);
	}, new Error('Invalid assets data was returned from MediaWiki API'));
});
