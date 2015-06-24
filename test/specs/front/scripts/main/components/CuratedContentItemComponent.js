moduleForComponent('curated-content-item', 'CuratedContentComponent');

test('returns correct icon name', function () {
	var componentMock = this.subject();

	Ember.run(function() {
		componentMock.set('type', 'category');
	});
	equal(componentMock.get('icon'), 'namespace-category');

	Ember.run(function() {
		componentMock.set('type', 'section');
	});
	equal(componentMock.get('icon'), 'namespace-category');

	Ember.run(function() {
		componentMock.set('type', 'video');
	});
	equal(componentMock.get('icon'), 'namespace-video');

	Ember.run(function() {
		componentMock.set('type', 'image');
	});
	equal(componentMock.get('icon'), 'namespace-image');

	Ember.run(function() {
		componentMock.set('type', 'blog');
	});
	equal(componentMock.get('icon'), 'namespace-blog');

	Ember.run(function() {
		componentMock.set('type', 'article');
	});
	equal(componentMock.get('icon'), 'namespace-article');

	Ember.run(function() {
		componentMock.set('type', 'whatever');
	});
	equal(componentMock.get('icon'), 'namespace-article');
});
