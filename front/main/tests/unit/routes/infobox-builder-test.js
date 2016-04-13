import Ember from 'ember';
import {test, moduleFor} from 'ember-qunit';
import sinon from 'sinon';

const params = {
		params: {
			'infobox-builder': {
				templateName: 'foo'
			}
		}
	},
	windowTop = {name: 'top'},
	windowSelf = {name: 'iframe'},
	originalWindowTop = window.top,
	originalWindowSelf = window.self;

let setupEnvironmentAndInfoboxDataSpy, loadAndSetupInfoboxDataSpy;

moduleFor('route:infoboxBuilder', 'Unit | Route | infobox builder', {
	beforeEach() {
		setupEnvironmentAndInfoboxDataSpy = sinon.stub().returns(Ember.RSVP.Promise.resolve());
		loadAndSetupInfoboxDataSpy = sinon.stub().returns(Ember.RSVP.Promise.resolve());
	},

	afterEach() {
		window.top = originalWindowTop;
		window.self = originalWindowSelf;
	}
});

/**
 * Mock setupEnvironmentAndInfoboxData and loadAndSetupInfoboxData
 * route methods
 *
 * @param {object} route
 * @returns {void}
 */
function mockRouteMethods(route) {
	route.setupEnvironmentAndInfoboxData = setupEnvironmentAndInfoboxDataSpy;
	route.loadAndSetupInfoboxData = loadAndSetupInfoboxDataSpy;
}

test('test is it iframe context', function (assert) {
	window.top = windowTop;
	window.self = windowSelf;

	const route = this.subject();

	assert.equal(route.get('isIframeContext'), true);
});

test('test is not it iframe context', function (assert) {
	window.self = window.top;

	const route = this.subject();

	assert.equal(route.get('isIframeContext'), false);
});

test('test are environment and infobox data set', function (assert) {
	window.top = windowTop;
	window.self = windowSelf;

	const route = this.subject();

	mockRouteMethods(route);

	assert.equal(route.get('isEnvironmentSet'), false);

	Ember.run(() => {
		route.beforeModel(params);
	});

	assert.equal(route.get('isIframeContext'), true);
	assert.equal(route.get('isEnvironmentSet'), true);
	assert.equal(setupEnvironmentAndInfoboxDataSpy.called, true);
	assert.equal(loadAndSetupInfoboxDataSpy.called, false);
});

test('test are evnironment resources not load again', function (assert) {
	window.top = windowTop;
	window.self = windowSelf;

	const route = this.subject({
		isEnvironmentSet: true
	});

	mockRouteMethods(route);

	Ember.run(() => {
		route.beforeModel(params);
	});

	assert.equal(route.get('isIframeContext'), true);
	assert.equal(setupEnvironmentAndInfoboxDataSpy.called, false);
	assert.equal(loadAndSetupInfoboxDataSpy.called, true);
});

