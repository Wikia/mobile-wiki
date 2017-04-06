import {test} from 'ember-qunit';
import {module} from 'qunit';
import {getModelForNamespace} from 'mobile-wiki/utils/wiki-handlers/wiki-page';
import Ember from 'ember';
import sinon from 'sinon';

module('Unit | Utility | wiki-handlers/wiki-page', (hooks) => {
	const articleModel = require('mobile-wiki/models/wiki/article').default,
		categoryModel = require('mobile-wiki/models/wiki/category').default,
		fileModel = require('mobile-wiki/models/wiki/file').default,
		mediawikiNamespace = require('mobile-wiki/utils/mediawiki-namespace').default;

	let articleCreateStub,
		articleSetDataStub,
		categoryCreateStub,
		categorySetDataStub,
		fileCreateStub,
		fileSetDataStub,
		isContentNamespaceStub;

	hooks.beforeEach(() => {
		articleCreateStub = sinon.stub(articleModel, 'create');
		articleSetDataStub = sinon.stub(articleModel, 'setData');
		categoryCreateStub = sinon.stub(categoryModel, 'create');
		categorySetDataStub = sinon.stub(categoryModel, 'setData');
		fileCreateStub = sinon.stub(fileModel, 'create');
		fileSetDataStub = sinon.stub(fileModel, 'setData');
		isContentNamespaceStub = sinon.stub(mediawikiNamespace, 'isContentNamespace');
	});

	hooks.afterEach(() => {
		articleCreateStub.restore();
		articleSetDataStub.restore();
		categoryCreateStub.restore();
		categorySetDataStub.restore();
		fileCreateStub.restore();
		fileSetDataStub.restore();
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
		assert.ok(articleSetDataStub.calledWith(expected, data), 'model filled with data');
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
		assert.ok(articleSetDataStub.calledWith(expected, data), 'model filled with data');
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
		assert.ok(categorySetDataStub.calledWith(expected, data), 'model filled with data');
	});

	test('getModelForNamespace - file', (assert) => {
		const data = {
				data: {
					ns: 6
				}
			},
			params = {
				title: 'Test'
			},
			expected = {
				file: true
			};

		fileCreateStub.returns(expected);
		isContentNamespaceStub.returns(false);

		assert.deepEqual(getModelForNamespace(data, params), expected, 'model returned');
		assert.ok(fileCreateStub.calledWith(params), 'model created');
		assert.ok(fileSetDataStub.calledWith(expected, data), 'model filled with data');
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
			expected = Ember.Object.create({
				redirectTo: null
			});

		isContentNamespaceStub.returns(false);

		assert.deepEqual(getModelForNamespace(data, params), expected, 'empty Ember.Object returned');
	});
});
