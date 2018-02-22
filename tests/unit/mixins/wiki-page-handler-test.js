import {getOwner} from '@ember/application';
import EmberObject from '@ember/object';
import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';
import sinon from 'sinon';
import require from 'require';
import WikiPageHandlerMixin from 'mobile-wiki/mixins/wiki-page-handler';

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

module('Unit | Mixins | Wiki Page Handler', function (hooks) {
	setupTest(hooks);

	hooks.beforeEach(function () {
		this.subject = function () {
			const WikiPageHandlerObject = EmberObject.extend(WikiPageHandlerMixin);

			this.owner.register('test-container:wiki-page-handler-object', WikiPageHandlerObject);

			return this.owner.lookup('test-container:wiki-page-handler-object');
		};
	});

	hooks.beforeEach(function () {
		articleSetDataStub = sinon.stub();
		articleCreateStub = sinon.stub(articleModel, 'create');
		categorySetDataStub = sinon.stub();
		categoryCreateStub = sinon.stub(categoryModel, 'create');
		fileSetDataStub = sinon.stub();
		fileCreateStub = sinon.stub(fileModel, 'create');
		isContentNamespaceStub = sinon.stub(mediawikiNamespace, 'isContentNamespace');
	});

	hooks.afterEach(function () {
		articleCreateStub.restore();
		categoryCreateStub.restore();
		fileCreateStub.restore();
		isContentNamespaceStub.restore();
	});

	test('getModelForNamespace - article', function (assert) {
		const data = {
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

	test('getModelForNamespace - main page in non-content namespace', function (assert) {
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
				mainPage: true,
				setData: articleSetDataStub
			};

		articleCreateStub.returns(expected);
		isContentNamespaceStub.returns(true);

		assert.deepEqual(this.subject().getModelForNamespace(data, params), expected, 'model returned');
		assert.ok(articleCreateStub.called, 'model created');
		assert.ok(articleSetDataStub.calledWith(data), 'model filled with data');
	});

	test('getModelForNamespace - category', function (assert) {
		const data = {
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

	test('getModelForNamespace - file', function (assert) {
		const data = {
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

	test('getModelForNamespace - unsupported namespace', function (assert) {
		const data = {
				data: {
					ns: 999
				}
			},
			params = {
				title: 'Test'
			},
			expected = EmberObject.create({
				redirectTo: null
			});

		isContentNamespaceStub.returns(false);

		assert.deepEqual(this.subject().getModelForNamespace(data, params), expected, 'empty Ember.Object returned');
	});
});
