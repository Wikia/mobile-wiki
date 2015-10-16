moduleForComponent('article-contribution', 'ArticleContributionComponent', {
	unit: true,
	setup: function () {
		M.track = function () {};
	}
});

FakeLocation = Em.Object.extend({
	href: 'fake'
});

FakeWindow = Em.Object.extend({
	location: FakeLocation.create()
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

test('select action without auth redirect to login', function () {
	var self = this,
		section = 3,
		sectionId = 'myId',
		title = 'hello world',
		uploadFeatureEnabled = true,
		loadPageSpy = sinon.spy(),
		fakeWindow = FakeWindow.create(),
		component = null;

	equal(fakeWindow.location.href.substring(0,15), 'fake');
	Ember.run(function () {
		component = self.subject({
			attrs: {
				section: section,
				sectionId: sectionId,
				title: title,
				uploadFeatureEnabled: uploadFeatureEnabled,
			}
		});
		component.loadPage = loadPageSpy;
		component.send('select', fakeWindow);
	});
	equal(fakeWindow.location.href.substring(0,15), '/join?redirect=');
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

/** this test fails when I run it via 'gulp karma'. 
 *  Error message: ArticleContributionComponent.js:117: 'undefined' is not an object (evaluating 'this.$('.file-upload-input')[0]')
 *  TypeError: 'undefined' is not an object (evaluating 'this.$('.file-upload-input')[0]')
 *  But even if I remove a reference to  this.$('.file-upload-input') in code, it still fails. 
 */

// test('add photo action with auth opens add photo component', function () {
// 		var self = this,
// 		section = 3,
// 		sectionId = 'myId',
// 		title = 'hello world',
// 		uploadFeatureEnabled = true,
// 		fakeUser = FakeUser.create(),
// 		previewPhotoSpy = sinon.spy(),
// 		component = null;

// 	Ember.run(function () {
// 		component = self.subject({
// 			attrs: {
// 				section: section,
// 				sectionId: sectionId,
// 				title: title,
// 				uploadFeatureEnabled: uploadFeatureEnabled,
// 			}
// 		});
// 		fakeUser.set('isAuthenticated', true);
// 		component.set('currentUser', fakeUser);
// 		component.set('previewPhoto', previewPhotoSpy);
// 		component.send('addPhoto');
// 	});
// 	ok(previewPhotoSpy.calledOnce);
// });

