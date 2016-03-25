import {test} from 'ember-qunit';
import {module} from 'qunit';
import {getModelForNamespace} from 'main/utils/wiki-handlers/wiki-page';
import Ember from 'ember';
import sinon from 'sinon';

module('Unit | Utils | wiki-handlers/wiki-page', (hooks) => {
	const originalArticleCreate = require('main/models/wiki/article').default.create,
		originalArticleSetArticle = require('main/models/wiki/article').default.setArticle,
		originalCategoryCreate = require('main/models/wiki/category').default.create,
		originalCategorySetCategory = require('main/models/wiki/category').default.setCategory,
		originalIsContentNamespace = require('main/utils/mediawiki-namespace').default.isContentNamespace,
		articleCreateStub = sinon.stub(),
		articleSetArticleStub = sinon.stub(),
		categoryCreateStub = sinon.stub(),
		categorySetCategoryStub = sinon.stub(),
		isContentNamespaceStub = sinon.stub();

	hooks.beforeEach(() => {
		require('main/models/wiki/article').default.create = articleCreateStub;
		require('main/models/wiki/article').default.setArticle = articleSetArticleStub;
		require('main/models/wiki/category').default.create = categoryCreateStub;
		require('main/models/wiki/category').default.setCategory = categorySetCategoryStub;
		require('main/utils/mediawiki-namespace').default.isContentNamespace = isContentNamespaceStub;
	});

	hooks.afterEach(() => {
		require('main/models/wiki/article').default.create = originalArticleCreate;
		require('main/models/wiki/article').default.setArticle = originalArticleSetArticle;
		require('main/models/wiki/category').default.create = originalCategoryCreate;
		require('main/models/wiki/category').default.setCategory = originalCategorySetCategory;
		require('main/utils/mediawiki-namespace').default.isContentNamespace = originalIsContentNamespace;

		articleCreateStub.reset();
		articleSetArticleStub.reset();
		categoryCreateStub.reset();
		categorySetCategoryStub.reset();
		isContentNamespaceStub.reset();
	});

	test('getModelForNamespace - article', (assert) => {
		const data = {
				data: {
					ns: 0
				}
			},
			params = {
				title: 'Test'
			},
			expected = {
				article: true
			};

		articleCreateStub.returns(expected);
		isContentNamespaceStub.returns(true);

		assert.deepEqual(getModelForNamespace(data, params), expected, 'model returned');
		assert.ok(articleCreateStub.calledWith(params), 'model created');
		assert.ok(articleSetArticleStub.calledWith(expected, data), 'model filled with data');
	});

	test('getModelForNamespace - main page in non-content namespace', (assert) => {
		const data = {
				data: {
					ns: 999,
					isMainPage: true
				}
			},
			params = {
				title: 'Test'
			},
			expected = {
				mainPage: true
			};

		articleCreateStub.returns(expected);
		isContentNamespaceStub.returns(true);

		assert.deepEqual(getModelForNamespace(data, params), expected, 'model returned');
		assert.ok(articleCreateStub.calledWith(params), 'model created');
		assert.ok(articleSetArticleStub.calledWith(expected, data), 'model filled with data');
	});

	test('getModelForNamespace - category', (assert) => {
		const data = {
				data: {
					ns: 14
				}
			},
			params = {
				title: 'Test'
			},
			expected = {
				category: true
			};

		categoryCreateStub.returns(expected);
		isContentNamespaceStub.returns(false);

		assert.deepEqual(getModelForNamespace(data, params), expected, 'model returned');
		assert.ok(categoryCreateStub.calledWith(params), 'model created');
		assert.ok(categorySetCategoryStub.calledWith(expected, data), 'model filled with data');
	});

	test('getModelForNamespace - unsupported namespace', (assert) => {
		const data = {
				data: {
					ns: 999
				}
			},
			params = {
				title: 'Test'
			},
			expected = Ember.Object.create();

		isContentNamespaceStub.returns(false);

		assert.deepEqual(getModelForNamespace(data, params), expected, 'empty Ember.Object returned');
	});
});
