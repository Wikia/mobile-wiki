import {moduleFor, test} from 'ember-qunit';
import sinon from 'sinon';

const assets = sinon.mock(require('main/services/config/resources'));

assets.object.default = {
	missingType: {
		paths: []
	},
	emptyLoadedBundle: {},
	properCssBundle: {
		paths: [],
		type: 'css'
	},
	cssBundleMissingPaths: {
		type: 'css'
	},
	cssBundlePathsNotArray: {
		paths: 'single/path/not/array.js',
		type: 'css'
	},
	randomTypeBundle: {
		type: 'someRandomType',
		paths: []
	}
};


moduleFor('service:resource-loader', 'Unit | Service | resource loader', {
	unit: true
});


test('CSS Resource has loaded status after load', function (assert) {
	const service = this.subject();

	service.load('properCssBundle').then((response) => {
		assert.equal(response, service.assetJustAddedStatusName);
		assert.equal(service.loaded.properCssBundle, true);
	}, () => {
		assert.ok(false, 'Plan was to resolve this promise, you shouldn\'t get here');
	});
});


test('Throw an error on non existent bundle name', function (assert) {
	const service = this.subject();

	service.load('nonExistentBundle').then(() => {
		assert.ok(false, 'Loading asset should get reject status here due to non existent bundle name');
	}, (error) => {
		assert.equal(error.message, 'Requested asset not found on avialable assets list');
	});
	assert.ok(true);
});


test('Don\'t load if resource already loaded', function (assert) {
	const service = this.subject();

	service.set('loaded.emptyLoadedBundle', true);

	service.load('emptyLoadedBundle').then((data) => {
		assert.equal(data, service.assetAlreadyLoadedStatusName);
	}, () => {
		assert.ok(false, 'Loading asset shouldn\'t reject here');
	});
	assert.ok(true);
});


test('Throw an error on type field missing in bundle config', function (assert) {
	const service = this.subject();

	service.load('missingType').then(() => {
		assert.ok(false, 'Loading asset should reject here due to missing type');
	}, (error) => {
		assert.equal(error.message, 'Missing type property in requested asset');
	});
	assert.ok(true);
});


test('Throw an error on non existent loader for type', function (assert) {
	const service = this.subject();

	service.load('randomTypeBundle').then(() => {
		assert.ok(false, 'Loading asset should reject here due to non existent loader for type');
	}, (error) => {
		assert.equal(error.message, 'Loader for provided type doesn\'t exist');
	});
	assert.ok(true);
});


test('Throw an error on paths field missing in bundle config', function (assert) {
	const service = this.subject();

	service.load('cssBundleMissingPaths').then(() => {
		assert.ok(false, 'Loading asset should reject here due to non existent paths field');
	}, (error) => {
		assert.equal(error.message, 'Missing paths property in requested asset');
	});
	assert.ok(true);
});


test('Throw an error on paths field not being an array', function (assert) {
	const service = this.subject();

	service.load('cssBundlePathsNotArray').then(() => {
		assert.ok(false, 'Loading asset should reject here due to paths field not being an array');
	}, (error) => {
		assert.equal(error.message, 'Provided paths property should be an array');
	});
	assert.ok(true);
});
