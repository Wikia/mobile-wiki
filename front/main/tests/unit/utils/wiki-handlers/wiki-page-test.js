import {test} from 'ember-qunit';
import {module} from 'qunit';
import {getModelForNamespace} from 'main/utils/wiki-handlers/wiki-page';
import Ember from 'ember';
import sinon from 'sinon';

module('Unit | Utility | wiki-handlers/wiki-page', (hooks) => {
	const articleModel = require('main/models/wiki/article').default,
		categoryModel = require('main/models/wiki/category').default,
		mediawikiNamespace = require('main/utils/mediawiki-namespace').default;

	let articleCreateStub,
		articleSetArticleStub,
		categoryCreateStub,
		categorySetCategoryStub,
		isContentNamespaceStub;

	hooks.beforeEach(() => {
		articleCreateStub = sinon.stub(articleModel, 'create');
		articleSetArticleStub = sinon.stub(articleModel, 'setArticle');
		categoryCreateStub = sinon.stub(categoryModel, 'create');
		categorySetCategoryStub = sinon.stub(categoryModel, 'setCategory');
		isContentNamespaceStub = sinon.stub(mediawikiNamespace, 'isContentNamespace');
	});

	hooks.afterEach(() => {
		articleCreateStub.restore();
		articleSetArticleStub.restore();
		categoryCreateStub.restore();
		categorySetCategoryStub.restore();
		isContentNamespaceStub.restore();
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
