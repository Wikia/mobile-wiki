import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';
import trackModule, { trackActions } from 'mobile-wiki/utils/track';

module('Integration | Component | post-search-results', (hooks) => {
  setupRenderingTest(hooks);

  const results = [
    {
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
    },
    {
      wikiId: 509,
      threadId: '3343172654596357155',
      createdAt: 1570795817,
      title: 'Coffee',
      content: 'Who want some coffee with prof. Minerva ...',
      rank: 9663.0759,
      articleTags: [],
      image: 'https://static.wikia.nocookie.net/79edae19-a4b0-4a87-b7a3-745c5aa2b6b5',
      type: 'post',
      url: 'https://harrypotter.fandom.com/f/p/3343172654596357155',
      pollVotes: 0,
      quizTakes: 0,
    },
    {
      wikiId: 681379,
      threadId: '3297856395936102760',
      createdAt: 1565146646,
      title: 'Coffee',
      content: 'Person: do you want coffee? Me: black, two sugars please I’ll be upstairs. (dramatically whooshes trench coat)',
      rank: 9537.2743,
      articleTags: [
        'Sherlock Holmes',
      ],
      image: '',
      type: 'post',
      url: 'https://bakerstreet.fandom.com/f/p/3297856395936102760',
      pollVotes: 0,
      quizTakes: 0,
    },
  ];

  const unit = {
    campaign: 'test',
    category: 'testing',
    tagline: 'Test 3-item Affiliate',
    image: 'https://static.wikia.nocookie.net/a136ba04-c922-40f2-89a6-f455b5ce895a',
    heading: 'This is a test affiliate unit',
    subheading: 'Click this link',
    link: 'https://www.fandom.com',
    links: {
      article: 'https://www.fandom.com/article-3',
      search: 'https://www.fandom.com/search-3',
    },
    country: ['US', 'CA', 'NL', 'AU', 'NZ'],
  };

  let trackStub;

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
    this.owner.register('service:wikiVariables', Service.extend({
      articlePath: '/de/wiki',
      enableDiscussions: true,
      // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
      language: {
        content: 'en',
      },
    }));

    trackStub = sinon.stub(trackModule, 'track');
  });

  hooks.afterEach(() => {
    trackStub.restore();
  });

  test('renders with post results and no affiliate unit', async function (assert) {
    assert.expect(3);

    const fetchFromUnifiedSearch = sinon.stub().returns(Promise.resolve({ results }));

    this.owner.register('service:fetch', Service.extend({ fetchFromUnifiedSearch }));

    await render(hbs`<PostSearchResults />`);

    assert.dom('.post-search-results > .post-search-results__header > .post-search-results__header-text', this.element)
      .hasText('main.search-post-items-header');
    assert.dom('.post-search-results > .post-search-results__items > *', this.element).exists({ count: results.length });

    assert.ok(trackStub.calledOnceWith({
      action: trackActions.impression,
      category: 'search_posts',
      label: 'recent_posts_shown',
    }));
  });

  test('renders with zero-state for no post results and no affiliate unit', async function (assert) {
    assert.expect(2);

    const fetchFromUnifiedSearch = sinon.stub().returns(Promise.resolve({ results: [] }));

    this.owner.register('service:fetch', Service.extend({ fetchFromUnifiedSearch }));

    await render(hbs`<PostSearchResults />`);

    assert.dom('.post-search-results > .post-search-results__items > .post-search-results__no-posts', this.element).exists();
    assert.ok(trackStub.notCalled);
  });

  test('renders with zero-state for post load error and no affiliate unit', async function (assert) {
    assert.expect(2);

    const fetchFromUnifiedSearch = sinon.stub().returns(Promise.reject());

    this.owner.register('service:fetch', Service.extend({ fetchFromUnifiedSearch }));

    await render(hbs`<PostSearchResults />`);

    assert.dom('.post-search-results > .post-search-results__items > .post-search-results__no-posts', this.element).exists();
    assert.ok(trackStub.notCalled);
  });

  test('displays show more button for local search', async function (assert) {
    assert.expect(1);

    const fetchFromUnifiedSearch = sinon.stub().returns(Promise.resolve({ results }));

    this.owner.register('service:fetch', Service.extend({ fetchFromUnifiedSearch }));

    await render(hbs`<PostSearchResults />`);

    assert.dom('.post-search-results > .post-search-results__header > .post-search-results__see-more', this.element).exists();
  });

  test('does not display show more button for cross-wiki search', async function (assert) {
    assert.expect(1);

    const fetchFromUnifiedSearch = sinon.stub().returns(Promise.resolve({ results }));

    this.owner.register('service:fetch', Service.extend({ fetchFromUnifiedSearch }));
    this.set('isCrossWiki', true);

    await render(hbs`<PostSearchResults @isCrossWiki={{this.isCrossWiki}} />`);

    assert.dom('.post-search-results > .post-search-results__header > .post-search-results__see-more', this.element).doesNotExist();
  });

  test('renders for cross-wiki search when discussions are disabled', async function (assert) {
    assert.expect(1);

    const fetchFromUnifiedSearch = sinon.stub().returns(Promise.resolve({ results }));

    this.owner.register('service:fetch', Service.extend({ fetchFromUnifiedSearch }));
    this.owner.register('service:wikiVariables', Service.extend({
      articlePath: '/de/wiki',
      enableDiscussions: false,
      // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
      language: {
        content: 'en',
      },
    }));

    this.set('isCrossWiki', true);

    await render(hbs`<PostSearchResults @isCrossWiki={{this.isCrossWiki}} />`);

    assert.dom('.post-search-results > .post-search-results__items > *', this.element).exists({ count: results.length });
  });

  test('does not render for local search when discussions are disabled', async function (assert) {
    assert.expect(2);

    const fetchFromUnifiedSearch = sinon.spy();

    this.owner.register('service:fetch', Service.extend({ fetchFromUnifiedSearch }));
    this.owner.register('service:wikiVariables', Service.extend({
      articlePath: '/de/wiki',
      enableDiscussions: false,
      // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
      language: {
        content: 'en',
      },
    }));

    await render(hbs`<PostSearchResults />`);

    assert.dom('.post-search-results', this.element).doesNotExist();
    assert.ok(fetchFromUnifiedSearch.notCalled);
  });

  test('renders with affiliate unit and post results', async function (assert) {
    assert.expect(2);

    const fetchFromUnifiedSearch = sinon.stub().returns(Promise.resolve({ results }));

    this.owner.register('service:fetch', Service.extend({ fetchFromUnifiedSearch }));
    this.setProperties({
      unit,
    });

    await render(hbs`<PostSearchResults @unit={{this.unit}} />`);

    assert.dom('.post-search-results > .post-search-results__items > *', this.element).exists({ count: results.length });
    assert.dom('.post-search-results > .post-search-results__disclaimer', this.element).exists();
  });

  test('calls tracker when load more button is clicked', async function (assert) {
    assert.expect(1);

    const fetchFromUnifiedSearch = sinon.stub().returns(Promise.resolve({ results }));

    this.owner.register('service:fetch', Service.extend({ fetchFromUnifiedSearch }));

    await render(hbs`<PostSearchResults />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('.post-search-results > .post-search-results__header > .post-search-results__see-more')
      .addEventListener('click', event => event.preventDefault());

    await click('.post-search-results > .post-search-results__header > .post-search-results__see-more');

    assert.ok(trackStub.getCall(1).calledWith({
      action: trackActions.click,
      category: 'search_posts',
      label: 'see-more',
    }));
  });
});
