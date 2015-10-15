moduleForComponent('article-contribution', 'ArticleContributionComponent', {
	unit: true,
	testmari: '',
	setup: function () {
		M.track = function () {};
	}
});

FakeLocation = Em.Object.extend({
	href: sinon.spy()
});

FakeWindow = Em.Object.extend({
	location: FakeLocation.create()
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

test('select action without auth redirect to login', function () {
	var self = this,
		section = 3,
		sectionId = 'myId',
		title = 'hello world',
		uploadFeatureEnabled = true,
		fakeWindow = FakeWindow.create(),
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
		
		component.send('select', fakeWindow);
	});
	equal(fakeWindow.location.href.substring(0,15), '/join?redirect=');
});
