import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | article-comment', (hooks) => {
  setupRenderingTest(hooks);

  const users = {
    'Gleek:D': {
      id: 4047575,
      avatar: 'https://vignette.wikia.nocookie.net/07984a0f-988e-46bd-9757-c96c5566ea07/scale-to-width-down/30',
      url: '/wiki/User:Gleek:D',
    },
  };

  const comment = {
    id: 2476019,
    text: '<p>What he said about Tina was so cute :)\n</p>\n',
    created: 1426939447,
    userName: 'Gleek:D',
    comments: [
      {
        id: 2476051,
        text: '<p>Glad he defended Finn, which encouraged them all to- and they all were well-developed here :)\n</p>\n',
        created: 1426940728,
        userName: 'Gleek:D',
      },
    ],
  };

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
  });

  test('renders comment', async function (assert) {
    assert.expect(3);

    this.setProperties({ comment: { ...comment, comments: [] }, users });

    await render(hbs`<ArticleComment @comment={{this.comment}} @users={{this.users}} />`);

    assert.dom('.username a', this.element).hasText(comment.userName);
    assert.dom('.username a', this.element).hasAttribute('href', users[comment.userName].url);

    assert.dom('.content > p', this.element).hasText('What he said about Tina was so cute :)\n');
  });

  test('renders comment with reply', async function (assert) {
    assert.expect(2);

    this.setProperties({ comment, users });

    await render(hbs`<ArticleComment @comment={{this.comment}} @users={{this.users}} />`);

    assert.dom('.show-reply-btn', this.element).exists();
    assert.dom('.content ul > *', this.element).exists({ count: comment.comments.length });
  });

  test('toggles reply visibility on button click', async function (assert) {
    assert.expect(4);

    this.setProperties({ comment, users });

    await render(hbs`<ArticleComment @comment={{this.comment}} @users={{this.users}} />`);

    assert.dom('.show-reply-btn', this.element).exists();
    assert.dom('.content ul').hasNoClass('expanded');

    await click('.show-reply-btn');

    assert.dom('.show-reply-btn', this.element).doesNotExist();
    assert.dom('.content ul').hasClass('expanded');
  });
});
