import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

const track = require('common/utils/track').track;

/**
 * @param {object} testThis
 * @param {bool} editAllowed
 * @returns {*} instance of article-contribution component
 */
function createComponent(testThis, editAllowed = true) {
	const section = 3,
		sectionId = 'myId',
		title = 'hello world',
		uploadFeatureEnabled = true;

	return testThis.subject({
		section,
		sectionId,
		title,
		uploadFeatureEnabled,
		editAllowed
	});
}

moduleForComponent('article-contribution', 'Unit | Component | article contribution', {
	unit: true,

	beforeEach() {
		require('common/utils/track').track = Ember.K;
	},

	afterEach() {
		require('common/utils/track').track = track;
	}
});

test('component is initialized', function (assert) {
	const section = 3,
		sectionId = 'myId',
		title = 'hello world',
		uploadFeatureEnabled = true,
		component = createComponent(this);

	assert.equal(component.section, section);
	assert.equal(component.sectionId, sectionId);
	assert.equal(component.title, title);
	assert.equal(component.uploadFeatureEnabled, uploadFeatureEnabled);
});

test('addPhoto action without auth redirects to login', function (assert) {
	const openLocationSpy = sinon.spy(),
		component = createComponent(this);

	component.openLocation = openLocationSpy;
	component.send('addPhoto');
	assert.ok(openLocationSpy.calledOnce);
});

test('edit action without editAllowed redirects to login', function (assert) {
	const openLocationSpy = sinon.spy(),
		component = createComponent(this, false);

	component.openLocation = openLocationSpy;
	component.send('edit');
	assert.ok(openLocationSpy.calledOnce);
});
