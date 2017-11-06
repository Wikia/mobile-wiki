define('mobile-wiki/tests/unit/mixins/wiki-page-handler-test', ['ember-qunit', 'sinon', 'require', 'mobile-wiki/mixins/wiki-page-handler'], function (_emberQunit, _sinon, _require2, _wikiPageHandler) {
	'use strict';

	var articleModel = (0, _require2.default)('mobile-wiki/models/wiki/article').default,
	    categoryModel = (0, _require2.default)('mobile-wiki/models/wiki/category').default,
	    fileModel = (0, _require2.default)('mobile-wiki/models/wiki/file').default,
	    mediawikiNamespace = (0, _require2.default)('mobile-wiki/utils/mediawiki-namespace').default;

	var articleCreateStub = void 0,
	    articleSetDataStub = void 0,
	    categoryCreateStub = void 0,
	    categorySetDataStub = void 0,
	    fileCreateStub = void 0,
	    fileSetDataStub = void 0,
	    isContentNamespaceStub = void 0;

	(0, _emberQunit.moduleFor)('mixin:wiki-page-handler', 'Unit | Mixins | Wiki Page Handler', {
		unit: true,
		needs: ['service:currentUser', 'service:fastboot', 'service:logger', 'service:wiki-variables'],

		beforeEach: function beforeEach() {
			articleSetDataStub = _sinon.default.stub();
			articleCreateStub = _sinon.default.stub(articleModel, 'create');
			categorySetDataStub = _sinon.default.stub();
			categoryCreateStub = _sinon.default.stub(categoryModel, 'create');
			fileSetDataStub = _sinon.default.stub();
			fileCreateStub = _sinon.default.stub(fileModel, 'create');
			isContentNamespaceStub = _sinon.default.stub(mediawikiNamespace, 'isContentNamespace');
		},
		afterEach: function afterEach() {
			articleCreateStub.restore();
			categoryCreateStub.restore();
			fileCreateStub.restore();
			isContentNamespaceStub.restore();
		},
		subject: function subject() {
			var WikiPageHandlerObject = Ember.Object.extend(_wikiPageHandler.default);

			this.register('test-container:wiki-page-handler-object', WikiPageHandlerObject);

			return Ember.getOwner(this).lookup('test-container:wiki-page-handler-object');
		}
	});

	(0, _emberQunit.test)('getModelForNamespace - article', function (assert) {
		var data = {
			data: {
				ns: 0
			}
		},
		    params = {
			title: 'Test'
		},
		    expected = {
			article: true,
			setData: articleSetDataStub
		};

		articleCreateStub.returns(expected);
		isContentNamespaceStub.returns(true);

		assert.deepEqual(this.subject().getModelForNamespace(data, params), expected, 'model returned');
		assert.ok(articleCreateStub.called, 'model created');
		assert.ok(articleSetDataStub.calledWith(data), 'model filled with data');
	});

	(0, _emberQunit.test)('getModelForNamespace - main page in non-content namespace', function (assert) {
		var data = {
			data: {
				ns: 999,
				isMainPage: true
			}
		},
		    params = {
			title: 'Test'
		},
		    expected = {
			mainPage: true,
			setData: articleSetDataStub
		};

		articleCreateStub.returns(expected);
		isContentNamespaceStub.returns(true);

		assert.deepEqual(this.subject().getModelForNamespace(data, params), expected, 'model returned');
		assert.ok(articleCreateStub.called, 'model created');
		assert.ok(articleSetDataStub.calledWith(data), 'model filled with data');
	});

	(0, _emberQunit.test)('getModelForNamespace - category', function (assert) {
		var data = {
			data: {
				ns: 14
			}
		},
		    params = {
			title: 'Test'
		},
		    expected = {
			category: true,
			setData: categorySetDataStub
		};

		categoryCreateStub.returns(expected);
		isContentNamespaceStub.returns(false);

		assert.deepEqual(this.subject().getModelForNamespace(data, params), expected, 'model returned');
		assert.ok(categoryCreateStub.called, 'model created');
		assert.ok(categorySetDataStub.calledWith(data), 'model filled with data');
	});

	(0, _emberQunit.test)('getModelForNamespace - file', function (assert) {
		var data = {
			data: {
				ns: 6
			}
		},
		    params = {
			title: 'Test'
		},
		    expected = {
			file: true,
			setData: fileSetDataStub
		};

		fileCreateStub.returns(expected);
		isContentNamespaceStub.returns(false);

		assert.deepEqual(this.subject().getModelForNamespace(data, params), expected, 'model returned');
		assert.ok(fileCreateStub.called, 'model created');
		assert.ok(fileSetDataStub.calledWith(data), 'model filled with data');
	});

	(0, _emberQunit.test)('getModelForNamespace - unsupported namespace', function (assert) {
		var data = {
			data: {
				ns: 999
			}
		},
		    params = {
			title: 'Test'
		},
		    expected = Ember.Object.create({
			redirectTo: null
		});

		isContentNamespaceStub.returns(false);

		assert.deepEqual(this.subject().getModelForNamespace(data, params), expected, 'empty Ember.Object returned');
	});
});