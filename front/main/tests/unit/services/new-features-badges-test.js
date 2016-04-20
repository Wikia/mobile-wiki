import Ember from 'ember';
import {test, moduleFor} from 'ember-qunit';

moduleFor('service:new-features-badges', {
	unit: true,
	beforeEach() {
		Ember.$.removeCookie('seenNewBadgeFor');
	}
});

/**
 * Set cookies for the test
 *
 * @param {string|array} cookies
 * @returns {void}
 */
function setUpCookie(cookies) {
	Ember.$.cookie('seenNewBadgeFor', JSON.stringify(cookies));
}

test('should fill array with many features names from cookie', function (assert) {
	const cookies = ['feature-one', 'featureTwo'];

	setUpCookie(cookies);

	assert.deepEqual(this.subject().get('features'), cookies);
});

test('should fill array with one feature name from cookie', function (assert) {
	const cookies = ['feature-one'];

	setUpCookie(cookies);

	assert.deepEqual(this.subject().get('features'), cookies);
});

test('should init empty array if cookie value is empty', function (assert) {
	setUpCookie('');

	assert.deepEqual(this.subject().get('features'), []);
});

test('should init empty array if cookie value is invalid', function (assert) {
	setUpCookie('feature-one');

	assert.deepEqual(this.subject().get('features'), []);
});

test('should init empty array if cookie does not exist', function (assert) {
	assert.deepEqual(this.subject().get('features'), []);
});

test('should display badge only for logged in users', function (assert) {
	setUpCookie(['feature-one', 'featureTwo']);

	const service = this.subject();

	service.set('currentUser', {
		isAuthenticated: true
	});

	assert.equal(service.shouldDisplay('feature-one'), false);
	assert.equal(service.shouldDisplay('featureTwo'), false);
	assert.equal(service.shouldDisplay('feature3'), true);
});

test('should not display badge for anon', function (assert) {
	setUpCookie(['feature-one', 'featureTwo']);

	const service = this.subject();

	service.set('currentUser', {
		isAuthenticated: false
	});

	assert.equal(service.shouldDisplay('feature-one'), false);
	assert.equal(service.shouldDisplay('featureTwo'), false);
	assert.equal(service.shouldDisplay('feature3'), false);
});

test('should display badge also for anons', function (assert) {
	setUpCookie(['feature-one', 'featureTwo']);

	const service = this.subject();

	service.set('currentUser', {
		isAuthenticated: false
	});

	assert.equal(service.shouldDisplay('feature-one', false), false);
	assert.equal(service.shouldDisplay('featureTwo', false), false);
	assert.equal(service.shouldDisplay('feature3', false), true);
});

test('should add feature to empty array', function (assert) {
	const service = this.subject(),
		featureName = 'featureName';

	service.addFeature(featureName);

	assert.deepEqual(service.get('features'), [featureName]);
});

test('should add feature to non empty array', function (assert) {
	setUpCookie(['feature-one', 'featureTwo']);

	const service = this.subject(),
		featureName = 'newFeatureName';

	service.addFeature(featureName, 0);

	assert.deepEqual(service.get('features'), ['feature-one', 'featureTwo', featureName]);
});
