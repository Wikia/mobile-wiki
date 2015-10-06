moduleForComponent('curated-content', 'CuratedContentComponent', {
	unit: true,

	setup: function () {
		M.track = function () {};
	}
});

test('handles click on a section properly', function () {
	var componentMock = this.subject(),
		sectionItem = {
			type: 'section'
		};

	componentMock.trackClick = function (category, label) {
		equal(category, 'modular-main-page');
		equal(label, 'curated-content-item-section');
	};

	// This is the analogue to openCuratedContentItem='openCuratedContentItem' in the parent template
	componentMock.set('openCuratedContentItem', 'openCuratedContentItem');

	componentMock.set('targetObject', {
		openCuratedContentItem: function (item) {
			equal(item, sectionItem)
		}
	});
	componentMock.send('clickItem', sectionItem);
});

test('handles click on a category properly', function () {
	var componentMock = this.subject(),
		categoryItem = {
			type: 'category'
		};

	componentMock.trackClick = function (category, label) {
		equal(category, 'modular-main-page');
		equal(label, 'curated-content-item-category');
	};

	// This is the analogue to openCuratedContentItem='openCuratedContentItem' in the parent template
	componentMock.set('openCuratedContentItem', 'openCuratedContentItem');

	componentMock.set('targetObject', {
		openCuratedContentItem: function (item) {
			equal(item, categoryItem)
		}
	});

	componentMock.send('clickItem', categoryItem);
});

test('handles click on an article properly', function () {
	var componentMock = this.subject(),
		articleItem = {
			type: 'article'
		};

	componentMock.trackClick = function (category, label) {
		equal(category, 'modular-main-page');
		equal(label, 'curated-content-item-article');
	};

	componentMock.send('clickItem', articleItem);
});

test('handles click on an item without a type properly', function () {
	var componentMock = this.subject(),
		otherItem = {
			label: 'whatever'
		};

	componentMock.trackClick = function (category, label) {
		equal(category, 'modular-main-page');
		equal(label, 'curated-content-item-other');
	};

	componentMock.send('clickItem', otherItem);
});
