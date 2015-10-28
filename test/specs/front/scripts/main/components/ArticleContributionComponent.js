moduleForComponent('article-contribution', 'ArticleContributionComponent', {
	unit: true,
	setup: function () {
		M.track = function () {};
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
		component = null;

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

test('loginToUploadPhoto action without auth redirect to login', function () {
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
		component.send('loginToUploadPhoto');
	});
	ok(openLocationSpy.calledOnce);
});

test('add photo action without auth do nothing', function () {
		var self = this,
		section = 3,
		sectionId = 'myId',
		title = 'hello world',
		uploadFeatureEnabled = true,
		fakeUser = FakeUser.create(),
		sendActionSpy = sinon.spy(),
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
		component.set('currentUser', fakeUser);
		component.sendAction = sendActionSpy;
		component.send('addPhoto');
	});
	notOk(sendActionSpy.calledOnce);
});
