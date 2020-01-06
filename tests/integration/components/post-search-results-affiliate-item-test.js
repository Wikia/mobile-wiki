import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import * as tracker from 'mobile-wiki/utils/track';

module('Integration | Component | post-search-results-affiliate-item', (hooks) => {
  setupRenderingTest(hooks);

  const simpleUnit = {
    campaign: 'disneyplus',
    category: 'marvel',
    tagline: 'Suggested For You',
    image: 'https://static.wikia.nocookie.net/e9744d88-2e2d-4581-a1cd-c80bfbfb0e50',
    heading: 'How to stream your favorites and more on Disney+',
    subheading: 'Get Started',
    link: 'https://www.fandom.com/articles/how-to-sign-up-disney-plus',
    country: ['US', 'CA', 'NL', 'AU', 'NZ'],
    isBig: true,
  };

  const ddbUnit = {
    campaign: 'ddb',
    category: 'ddb-test-unit-id',
    tagline: 'Suggested For You',
    image: 'https://static.wikia.nocookie.net/2d18111c-bc45-458f-9898-d2d4e3a50589',
    heading: 'CLICK ME FOR DDB',
    subheading: 'DDB subheading',
    link: 'https://www.dndbeyond.com/',
    country: ['US', 'CA', 'NL'],
  };

  const multiLinkUnit = {
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

  const postIndex = 2;

  test('renders with simple unit', async function (assert) {
    assert.expect(5);

    this.set('unit', simpleUnit);
    this.set('postIndex', postIndex);

    await render(hbs`<PostSearchResultsAffiliateItem @affiliateUnit={{this.unit}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-affiliate-item__image', this.element).hasAttribute('src', simpleUnit.image);
    assert.dom('.post-search-results-affiliate-item__image', this.element).hasAttribute('alt', simpleUnit.heading);

    assert.dom('.post-search-results-affiliate-item__title', this.element).hasAttribute('href', simpleUnit.link);
    assert.dom('.post-search-results-affiliate-item__title', this.element).hasText(simpleUnit.heading);

    assert.dom('.post-search-results-affiliate-item__details', this.element).hasText(simpleUnit.subheading);
  });

  test('renders with unit with no image', async function (assert) {
    assert.expect(2);

    this.set('unit', { ...simpleUnit, image: null });
    this.set('postIndex', postIndex);

    await render(hbs`<PostSearchResultsAffiliateItem @affiliateUnit={{this.unit}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-affiliate-item__image', this.element).doesNotExist();

    assert.dom('.post-search-results-affiliate-item__title', this.element).hasText(simpleUnit.heading);
  });

  test('renders with multiple link unit on search page', async function (assert) {
    assert.expect(1);

    this.set('unit', multiLinkUnit);
    this.set('postIndex', postIndex);

    await render(hbs`<PostSearchResultsAffiliateItem @affiliateUnit={{this.unit}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-affiliate-item__title', this.element).hasAttribute('href', multiLinkUnit.links.search);
  });

  test('renders with multiple link unit in content', async function (assert) {
    assert.expect(1);

    this.set('unit', multiLinkUnit);
    this.set('isInContent', true);
    this.set('postIndex', postIndex);

    await render(hbs`<PostSearchResultsAffiliateItem @affiliateUnit={{this.unit}} @isInContent={{this.isInContent}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-affiliate-item__title', this.element).hasAttribute('href', multiLinkUnit.links.article);
  });

  test('renders with DDB unit on search page', async function (assert) {
    assert.expect(1);

    this.set('unit', ddbUnit);
    this.set('postIndex', postIndex);

    await render(hbs`<PostSearchResultsAffiliateItem @affiliateUnit={{this.unit}} @postIndex={{this.postIndex}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-affiliate-item__title', this.element).hasAttribute('href', `${ddbUnit.link}&fandom_slot_id=search_posts`);
  });

  test('renders with DDB unit in content', async function (assert) {
    assert.expect(1);

    this.set('unit', ddbUnit);
    this.set('isInContent', true);
    this.set('postIndex', postIndex);

    await render(hbs`<PostSearchResultsAffiliateItem @affiliateUnit={{this.unit}} @isInContent={{this.isInContent}} @postIndex={{this.postIndex}} />`);

    assert.dom('.post-search-results-affiliate-item__title', this.element).hasAttribute('href', `${ddbUnit.link}&fandom_slot_id=incontent_posts`);
  });

  test('calls trackAffiliateUnit when title is clicked', async function (assert) {
    assert.expect(1);

    const trackAffiliateUnit = sinon.stub(tracker, 'trackAffiliateUnit');

    this.set('unit', simpleUnit);
    this.set('postIndex', postIndex);

    await render(hbs`<PostSearchResultsAffiliateItem @affiliateUnit={{this.unit}} @postIndex={{this.postIndex}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('.post-search-results-affiliate-item__title')
      .addEventListener('click', event => event.preventDefault());

    await click('.post-search-results-affiliate-item__title');

    assert.ok(trackAffiliateUnit.calledOnceWith(simpleUnit, {
      action: tracker.trackActions.click,
      category: 'affiliate_search_posts',
      label: `item-${postIndex}`,
    }));

    trackAffiliateUnit.restore();
  });

  test('calls trackAffiliateUnit in content when title is clicked', async function (assert) {
    assert.expect(1);

    const trackAffiliateUnit = sinon.stub(tracker, 'trackAffiliateUnit');

    this.set('unit', simpleUnit);
    this.set('postIndex', postIndex);
    this.set('isInContent', true);

    await render(hbs`<PostSearchResultsAffiliateItem @affiliateUnit={{this.unit}} @postIndex={{this.postIndex}} @isInContent={{this.isInContent}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('.post-search-results-affiliate-item__title')
      .addEventListener('click', event => event.preventDefault());

    await click('.post-search-results-affiliate-item__title');

    assert.ok(trackAffiliateUnit.calledOnceWith(simpleUnit, {
      action: tracker.trackActions.click,
      category: 'affiliate_incontent_posts',
      label: `item-${postIndex}`,
    }));

    trackAffiliateUnit.restore();
  });
});
