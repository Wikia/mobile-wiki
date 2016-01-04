import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

var track;

moduleForComponent('article-contribution', 'Unit | Component | article contribution', {
	unit: true,
	beforeEach: function () {
		track = require('common/utils/track').track;
		require('common/utils/track').track = Ember.K;
	},
	afterEach: function () {
		track = require('common/utils/track').track;
	}
});

FakeUser = Ember.Object.extend({
	isAuthenticated: false
});

test('component is initialized', function (assert) {
	var section = 3,
		sectionId = 'myId',
		title = 'hello world',
		uploadFeatureEnabled = true,
		component = this.subject({
			attrs: {
				section: section,
				sectionId: sectionId,
				title: title,
				uploadFeatureEnabled: uploadFeatureEnabled,
			}
		});

	assert.equal(component.section, 3);
	assert.equal(component.sectionId, 'myId');
	assert.equal(component.title, 'hello world');
	assert.equal(component.uploadFeatureEnabled, true);
});

test('addPhoto action without auth redirects to login', function (assert) {
	var self = this,
		section = 3,
		sectionId = 'myId',
		title = 'hello world',
		uploadFeatureEnabled = true,
		openLocationSpy = sinon.spy(),
		component = null;

	Ember.run(function () {
		component = self.subject({
			attrs: {
				section: section,
				sectionId: sectionId,
				title: title,
				uploadFeatureEnabled: uploadFeatureEnabled,
			}
		});
		component.openLocation = openLocationSpy;
		component.send('addPhoto');
	});
	assert.ok(openLocationSpy.calledOnce);
});

test('edit action without editAllowed redirects to login', function (assert) {
	var self = this,
		section = 3,
		sectionId = 'myId',
		title = 'hello world',
		uploadFeatureEnabled = true,
		openLocationSpy = sinon.spy(),
		component = null;

	Ember.run(function () {
		component = self.subject({
			attrs: {
				section: section,
				sectionId: sectionId,
				title: title,
				uploadFeatureEnabled: uploadFeatureEnabled,
				editAllowed: false,
			}
		});
		component.openLocation = openLocationSpy;
		component.send('edit');
	});
	assert.ok(openLocationSpy.calledOnce);
});
