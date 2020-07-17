import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import Service from '@ember/service';

module('Integration | Component | article-comments', (hooks) => {
  setupRenderingTest(hooks);

  let load;
  let fetchCount;
  let getUrlThreadParams = () => ({ urlThreadId: undefined, urlReplyId: undefined });

  hooks.beforeEach(function () {
    load = sinon.spy();
    fetchCount = sinon.stub();
    this.owner.register('service:article-comments', Service.extend({ load, fetchCount, getUrlThreadParams }));
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
    this.owner.register('service:wikiVariables', Service.extend({
      // To match mirage fixture for comments API
      host: 'fallout.wikia.com',
    }));
  });

  test('calls load and renders empty container for UCP', async function (assert) {
    assert.expect(2);

    this.setProperties({
      // To match mirage fixture for comments API
      articleId: 10,
      articleTitle: 'Foo',
      articleNamespace: 0,
      isUcp: true,
    });

    fetchCount.withArgs(this.get('articleTitle'), this.get('articleNamespace')).returns(Promise.resolve(8));

    await render(hbs`<ArticleComments @isUcp={{this.isUcp}} @page="1" @articleId={{this.articleId}} @articleTitle={{this.articleTitle}} @articleNamespace={{this.articleNamespace}} />`);

    assert.dom('#articleComments').exists();
    assert.ok(load.calledOnceWith({
      title: this.get('articleTitle'),
      namespace: this.get('articleNamespace'),
    }));
  });

  test('hides comment section for UCP when toggle is clicked', async function (assert) {
    assert.expect(2);

    this.setProperties({
      articleId: 10,
      articleTitle: 'Foo',
      articleNamespace: 0,
      isUcp: true,
    });

    await render(hbs`<ArticleComments @isUcp={{this.isUcp}} @page="1" @articleId={{this.articleId}} @articleTitle={{this.articleTitle}} @articleNamespace={{this.articleNamespace}} />`);
    await click('.show-comments-btn');

    assert.dom('#articleComments').doesNotExist();
    assert.dom('.show-comments-btn').hasClass('collapsed');
  });

  test('renders comments from BE on non-UCP', async function (assert) {
    assert.expect(2);

    this.setProperties({
      articleId: 10,
      articleTitle: 'Foo',
      articleNamespace: 0,
      isUcp: false,
      commentsCount: 7,
    });

    await render(hbs`<ArticleComments @isUcp={{this.isUcp}} @page="1" @commentsCount={{this.commentsCount}} @articleId={{this.articleId}} @articleTitle={{this.articleTitle}} @articleNamespace={{this.articleNamespace}} />`);

    assert.dom('#articleComments').doesNotExist();
    assert.dom('ul.comments > *').exists({ count: this.get('commentsCount') });
  });
});
