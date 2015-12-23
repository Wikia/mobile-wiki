var track;

moduleForComponent('article-contribution', 'ArticleContributionComponent', {
	unit: true,
	setup: function () {
		track = mrequire('mercury/utils/track').track;
		mrequire('mercury/utils/track').track = Em.K;
	},
	teardown: function () {
		track = mrequire('mercury/utils/track').track;
	}
});

FakeUser = Em.Object.extend({
	isAuthenticated: false
});

test('component is initialized', function () {
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

	equal(component.section, 3);
	equal(component.sectionId, 'myId');
	equal(component.title, 'hello world');
	equal(component.uploadFeatureEnabled, true);
});

test('addPhoto action without auth redirects to login', function () {
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
	ok(openLocationSpy.calledOnce);
});

test('edit action without editAllowed redirects to login', function () {
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
	ok(openLocationSpy.calledOnce);
});
