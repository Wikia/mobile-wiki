import {moduleFor, test} from 'ember-qunit';
import sinon from 'sinon';
import Ember from 'ember';

const {RSVP} = Ember;
const assets = sinon.mock(require('main/services/config/resources'));

assets.object.default = {
	emptyBundle: {},
	emptyLoadedBundle: {},
	properCssBundle: {
		data: {},
		type: 'css'
	},
	properCssBundle2: {
		data: {},
		type: 'css'
	},
	cssBundleMissingData: {
		type: 'css'
	},
	randomTypeBundle: {
		type: 'someRandomType'
	}
};


moduleFor('service:resource-loader', 'Unit | Service | resource loader', {
	unit: true
});


test('CSS Resource has loaded status after load', function (assert) {
	const service = this.subject();

	service.set('ajax', {
		request: () => {
			return RSVP.resolve({css: []});
		}
	});

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

	service.load('emptyBundle').then(() => {
		assert.ok(false, 'Loading asset should reject here due to missing type');
	}, (error) => {
		assert.equal(error.message, 'Missing type property in requested asset');
	});
	assert.ok(true);
});


test('Throw an error on non existent loader for type', function (assert) {
	const service = this.subject();

	service.load('randomTypeBundle').then(() => {
		assert.fail('Loading asset should reject here due to non existent loader for type');
	}, (error) => {
		assert.equal(error.message, 'Loader for provided type doesn\'t exist');
	});
	assert.ok(true);
});


test('Throw an error on data field missing in bundle config', function (assert) {
	const service = this.subject();

	service.load('cssBundleMissingData').then(() => {
		assert.ok(false, 'Loading asset should reject here due to non existent data field');
	}, (error) => {
		assert.equal(error.message, 'Missing data property in requested asset');
	});
	assert.ok(true);
});


test('Throw an error for corrupted data from API', function (assert) {
	const service = this.subject();

	service.set('ajax', {
		request: () => {
			return {
				then: (callback) => {
					try {
						return callback();
					} catch (e) {
						return RSVP.reject(e);
					}
				}
			};
		}
	});

	service.load('properCssBundle2').then(() => {
		assert.ok(false, 'Loading asset should reject here due to corrupted data from mocked API');
	}, (error) => {
		assert.equal(error.message, 'Invalid assets data was returned from MediaWiki API');
	});
	assert.ok(true);
});
