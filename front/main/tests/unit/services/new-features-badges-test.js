import Ember from 'ember';
import {test, moduleFor} from 'ember-qunit';

moduleFor('service:new-features-badges', {
	beforeEach: function () {
		Ember.$.removeCookie('seenNewBadgeFor');
	}
});

function setUpService(service, cookies) {
	Ember.$.cookie('seenNewBadgeFor', JSON.stringify(cookies));
	service.init();
}

test('should fill array with many features names from cookie', function (assert) {
	const cookies = ['feature-one', 'featureTwo'],
		service = this.subject();

	setUpService(service, cookies);

	assert.deepEqual(service.get('features'), cookies);
});

test('should fill array with one feature name from cookie', function (assert) {
	const cookies = ['feature-one'],
		service = this.subject();

	setUpService(service, cookies);

	assert.deepEqual(service.get('features'), cookies);
});

test('should init empty array if cookie value is empty', function (assert) {
	const service = this.subject();

	setUpService(service, '');

	assert.deepEqual(service.get('features'), []);
});

test('should init empty array if cookie value is invalid', function (assert) {
	const service = this.subject();

	setUpService(service, 'feature-one');

	assert.deepEqual(service.get('features'), []);
});

test('should init empty array if cookie does not exist', function (assert) {
	const service = this.subject();

	service.init();
	assert.deepEqual(this.subject().get('features'), []);
});

test('should display badge only for logged in users', function (assert) {
	const service = this.subject();

	service.set('currentUser', {
		isAuthenticated: true
	});

	setUpService(service, ['feature-one', 'featureTwo']);

	assert.equal(service.shouldDisplay('feature-one'), false);
	assert.equal(service.shouldDisplay('featureTwo'), false);
	assert.equal(service.shouldDisplay('feature3'), true);
});

test('should display badge only for logged in users and user is not', function (assert) {
	const service = this.subject();

	service.set('currentUser', {
		isAuthenticated: false
	});

	setUpService(service, ['feature-one', 'featureTwo']);

	assert.equal(service.shouldDisplay('feature-one'), false);
	assert.equal(service.shouldDisplay('featureTwo'), false);
	assert.equal(service.shouldDisplay('feature3'), false);
});

test('should display badge also for anons', function (assert) {
	const service = this.subject();

	service.set('currentUser', {
		isAuthenticated: false
	});

	setUpService(service, ['feature-one', 'featureTwo']);

	assert.equal(service.shouldDisplay('feature-one', false), false);
	assert.equal(service.shouldDisplay('featureTwo', false), false);
	assert.equal(service.shouldDisplay('feature3', false), true);
});

test('should add feature to empty array', function (assert) {
	const service = this.subject(),
		featureName = 'featureName';

	service.init();
	service.addFeature(featureName);

	assert.deepEqual(service.get('features'), [featureName]);
});

test('should add feature to non empty array', function (assert) {
	const service = this.subject(),
		featureName = 'newFeatureName';

	setUpService(service, ['feature-one', 'featureTwo']);

	service.addFeature(featureName, 0);

	assert.deepEqual(service.get('features'), ['feature-one', 'featureTwo', featureName]);
});
