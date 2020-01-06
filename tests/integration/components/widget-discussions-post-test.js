import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import Service from '@ember/service';

module('Integration | Component | widget-discussions-post', (hooks) => {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
  });

  const post = {
    categoryName: 'General',
    contentImages: null,
    createdBy: {
      avatarUrl: 'https://static.wikia.nocookie.net/864bbe17-2e77-4081-8eff-1f7c262bb66f',
      badgePermission: 'badge:sysop',
      id: '25016014',
      name: 'Cristina7',
      profileUrl: 'https://cristinatest.fandom.com/wiki/User:Cristina7?useskin=oasis',
    },
    creationTimestamp: 1564187365,
    id: '3300297438923061069',
    openGraph: null,
    rawContent: '@violetgreen333, hey!',
    repliesCount: 4,
    title: 'Testing',
    threadId: '3300297438920800246',
    upvoteCount: 12,
    userData: {
      hasUpvoted: false,
    },
  };

  const openGraph = {
    description: '25 Likes, 1 Comments - FANDOM (@getfandom) on Instagram: “We all have that one friend who is still catching up on Stranger Things 🏃👀 . . . . . #erica…”',
    domain: 'www.instagram.com',
    imageHeight: 1080,
    imageUrl: 'https://static.wikia.nocookie.net/3cc02252-974f-4913-9af9-6bca8940231a',
    imageWidth: 1080,
    siteName: 'Instagram',
    title: 'Instagram post by FANDOM • Nov 3, 2017 at 11:31am UTC',
    type: 'instapp:photo',
    url: 'https://www.instagram.com/p/BbCBEEzhJ80/',
  };

  test('renders', async function (assert) {
    assert.expect(9);

    this.setProperties({
      post,
      upvote() {},
    });

    await render(hbs`<WidgetDiscussionsPost @post={{this.post}} @upvote={{this.upvote}} />`);

    assert.dom('.post-header > .user-avatar > a.avatar-username', this.element).hasAttribute('href', post.createdBy.profileUrl);
    assert.dom('.post-header > .user-avatar > a.avatar-username', this.element).hasText(post.createdBy.name);

    assert.dom('.discussion-content > .post-title > a.post-details-link', this.element).hasAttribute('href', `/d/p/${post.threadId}`);
    assert.dom('.discussion-content > .post-title > a.post-details-link', this.element).hasText(post.title);

    assert.dom('.discussion-content > a.post-details-link', this.element).hasText(post.rawContent);

    assert.dom('.post-bottom-row > .post-counters > .upvote-count', this.element).hasText(`${post.upvoteCount}`);
    assert.dom('.post-bottom-row > .post-counters > .reply-count', this.element).hasText(`${post.repliesCount}`);

    assert.dom('.post-actions > .upvote', this.element).doesNotHaveClass('has-upvoted');

    assert.dom('.post-actions > .replies > a', this.element).hasAttribute('href', `/d/p/${post.threadId}`);
  });

  test('renders upvoted', async function (assert) {
    assert.expect(1);

    const userData = {
      hasUpvoted: true,
    };

    this.setProperties({
      post: { ...post, userData },
      upvote() {},
    });

    await render(hbs`<WidgetDiscussionsPost @post={{this.post}} @upvote={{this.upvote}} />`);

    assert.dom('.post-actions > .upvote', this.element).hasClass('has-upvoted');
  });

  test('renders with no title', async function (assert) {
    assert.expect(2);

    this.setProperties({
      post: { ...post, title: null },
      upvote() {},
    });

    await render(hbs`<WidgetDiscussionsPost @post={{this.post}} @upvote={{this.upvote}} />`);

    assert.dom('.discussion-content > .post-title', this.element).doesNotExist();
    assert.dom('.discussion-content > a.post-details-link', this.element).hasText(post.rawContent);
  });

  test('renders with OG card with image', async function (assert) {
    assert.expect(6);

    this.setProperties({
      post: { ...post, openGraph },
      upvote() {},
    });

    await render(hbs`<WidgetDiscussionsPost @post={{this.post}} @upvote={{this.upvote}} />`);

    assert.dom('.discussion-content + a.og-container', this.element).hasAttribute('href', openGraph.url);
    assert.dom('.discussion-content + a.og-container', this.element).hasAttribute('title', openGraph.title);

    assert.dom('.discussion-content + a.og-container > .og-image', this.element).hasAttribute('src', `${openGraph.imageUrl}/zoom-crop/width/525/height/295`);
    assert.dom('.discussion-content + a.og-container > .og-image', this.element).hasAttribute('alt', openGraph.title);

    assert.dom('.discussion-content + a.og-container > .og-texts > .og-title', this.element).hasText(openGraph.title);
    assert.dom('.discussion-content + a.og-container > .og-texts > .og-site-name', this.element).hasText(openGraph.domain);
  });

  test('renders with OG card with no image', async function (assert) {
    assert.expect(3);

    const openGraphWithNoImage = { ...openGraph, imageUrl: null };

    this.setProperties({
      post: { ...post, openGraph: openGraphWithNoImage },
      upvote() {},
    });

    await render(hbs`<WidgetDiscussionsPost @post={{this.post}} @upvote={{this.upvote}} />`);

    assert.dom('.discussion-content + a.og-container', this.element).hasAttribute('href', openGraph.url);
    assert.dom('.discussion-content + a.og-container', this.element).hasAttribute('title', openGraph.title);

    assert.dom('.discussion-content + a.og-container > .og-image', this.element).doesNotExist();
  });

  test('calls upvote param on upvote click', async function (assert) {
    assert.expect(1);

    const upvote = sinon.spy();

    this.setProperties({
      post,
      upvote,
    });

    await render(hbs`<WidgetDiscussionsPost @post={{this.post}} @upvote={{this.upvote}} />`);

    await click('.post-actions > .upvote');

    assert.ok(upvote.calledOnceWith(post));
  });
});
