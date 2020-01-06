import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import trackModule, { trackActions } from 'mobile-wiki/utils/track';
import Service from '@ember/service';

module('Integration | Component | post-search-results-item', (hooks) => {
  setupRenderingTest(hooks);

  const post = {
    wikiId: 1668557,
    threadId: '3100000000000020033',
    createdAt: 1576734006,
    title: 'cOfFeE!',
    content: '',
    rank: 9794.7346,
    articleTags: [
      'Accessories',
      'Christmas',
      'Christmas/2019',
      'Princess Starfrost',
    ],
    image: 'https://static.wikia.nocookie.net/71cf28a2-d1d5-4d53-b094-8c48e27d2fbe',
    type: 'post',
    url: 'https://royale-high.fandom.com/f/p/3100000000000020033',
    pollVotes: 0,
    quizTakes: 0,
  };

  const postIndex = 2;

  let trackStub;

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
    trackStub = sinon.stub(trackModule, 'track');
  });

  hooks.afterEach(() => {
    trackStub.restore();
  });

  test('renders for post with image', async function (assert) {
    assert.expect(5);

    this.setProperties({ post, postIndex });

    await render(hbs`<PostSearchResultsItem @post={{this.post}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-item__title', this.element).hasText(post.title);
    assert.dom('.post-search-results-item__title', this.element).hasAttribute('href', post.url);

    assert.dom('.post-search-results-item__image', this.element).hasAttribute('alt', post.title);
    assert.dom('.post-search-results-item__image', this.element).hasAttribute('src', 'https://static.wikia.nocookie.net/71cf28a2-d1d5-4d53-b094-8c48e27d2fbe/smart/width/48/height/48');

    assert.dom('.post-search-results-item__details', this.element).hasText('search:main.search-post-item-post-posted');
  });

  test('renders for post with no image', async function (assert) {
    assert.expect(2);

    this.setProperties({ post: { ...post, image: null }, postIndex });

    await render(hbs`<PostSearchResultsItem @post={{this.post}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-item__title', this.element).hasText(post.title);
    assert.dom('.post-search-results-item__image', this.element).doesNotExist();
  });

  test('renders for post with no title', async function (assert) {
    assert.expect(1);

    this.setProperties({
      post: {
        ...post, title: null, image: null, content: 'Test content',
      },
      postIndex,
    });

    await render(hbs`<PostSearchResultsItem @post={{this.post}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-item__title', this.element).hasText('Test content');
  });

  test('renders for quiz with no takes', async function (assert) {
    assert.expect(1);

    this.setProperties({ post: { ...post, type: 'quiz' }, postIndex });

    await render(hbs`<PostSearchResultsItem @post={{this.post}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-item__details', this.element).hasText('search:main.search-post-item-post-posted');
  });

  test('renders for quiz with takes', async function (assert) {
    assert.expect(1);

    this.setProperties({ post: { ...post, type: 'quiz', quizTakes: 56 }, postIndex });

    await render(hbs`<PostSearchResultsItem @post={{this.post}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-item__details', this.element).hasText('search:main.search-post-item-quiz-takes');
  });

  test('renders for poll with no votes', async function (assert) {
    assert.expect(1);

    this.setProperties({ post: { ...post, type: 'poll' }, postIndex });

    await render(hbs`<PostSearchResultsItem @post={{this.post}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-item__details', this.element).hasText('search:main.search-post-item-post-posted');
  });

  test('renders for poll with votes', async function (assert) {
    assert.expect(1);

    this.setProperties({ post: { ...post, type: 'poll', pollVotes: 14 }, postIndex });

    await render(hbs`<PostSearchResultsItem @post={{this.post}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-item__details', this.element).hasText('search:main.search-post-item-poll-votes');
  });

  test('calls tracker when post title is clicked', async function (assert) {
    assert.expect(1);

    this.setProperties({ post, postIndex });

    await render(hbs`<PostSearchResultsItem @post={{this.post}} @postIndex={{this.postIndex}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('.post-search-results-item__title')
      .addEventListener('click', event => event.preventDefault());

    await click('.post-search-results-item__title');

    assert.ok(trackStub.calledOnceWith({
      action: trackActions.click,
      category: 'search_posts',
      label: `item-${postIndex + 1}`,
    }));
  });
});
