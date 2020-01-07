import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';
import trackModule, { trackActions } from 'mobile-wiki/utils/track';

module('Integration | Component | affiliate-unit', (hooks) => {
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

  const huluUnit = {
    campaign: 'disneyplus',
    category: 'hulu',
    tagline: 'Recommended for You',
    image: 'https://static.wikia.nocookie.net/e9744d88-2e2d-4581-a1cd-c80bfbfb0e50',
    heading: 'Upgrade Your Hulu Bundle with Disney+',
    subheading: 'Upgrade Now',
    link: 'https://fandom.com/articles/disney-plus-bundle-how-to',
    isBig: true,
    isHulu: true,
    country: ['US', 'CA', 'NL', 'AU', 'NZ'],
  };

  let trackAffiliateUnit;

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
    trackAffiliateUnit = sinon.stub(trackModule, 'trackAffiliateUnit');
  });

  hooks.afterEach(() => {
    trackAffiliateUnit.restore();
  });

  test('renders with simple unit', async function (assert) {
    assert.expect(5);

    this.setProperties({
      unit: simpleUnit,
      isInContent: true,
    });

    await render(hbs`<AffiliateUnit @unit={{this.unit}} @isInContent={{this.isInContent}} />`);

    assert.dom('.affiliate-unit__header', this.element).hasText(simpleUnit.tagline);
    assert.dom('.affiliate-unit__subheading', this.element).hasText(simpleUnit.subheading);

    assert.dom('.affiliate-unit__link', this.element).hasAttribute('href', simpleUnit.link);
    assert.dom('.affiliate-unit__image', this.element).hasAttribute('src', simpleUnit.image);

    assert.dom('.affiliate-unit__svg-wrapper', this.element).doesNotExist();
  });

  test('renders with multiple link unit', async function (assert) {
    assert.expect(1);

    this.setProperties({
      unit: multiLinkUnit,
      isInContent: true,
    });

    await render(hbs`<AffiliateUnit @unit={{this.unit}} @isInContent={{this.isInContent}} />`);

    assert.dom('.affiliate-unit__link', this.element).hasAttribute('href', multiLinkUnit.links.article);
  });

  test('renders with Hulu unit', async function (assert) {
    assert.expect(1);

    this.setProperties({
      unit: huluUnit,
      isInContent: true,
    });

    await render(hbs`<AffiliateUnit @unit={{this.unit}} @isInContent={{this.isInContent}} />`);

    assert.dom('.affiliate-unit__svg-wrapper', this.element).exists();
  });

  test('renders with DDB unit', async function (assert) {
    assert.expect(1);

    this.setProperties({
      unit: ddbUnit,
      isInContent: true,
    });

    await render(hbs`<AffiliateUnit @unit={{this.unit}} @isInContent={{this.isInContent}} />`);

    assert.dom('.affiliate-unit__link', this.element).hasAttribute('href', `${ddbUnit.link}&fandom_slot_id=incontent_recommend&`);
  });

  test('calls trackAffiliateUnit when element is clicked', async function (assert) {
    assert.expect(1);

    this.setProperties({
      unit: simpleUnit,
      isInContent: true,
    });

    await render(hbs`<AffiliateUnit @unit={{this.unit}} @isInContent={{this.isInContent}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('.affiliate-unit__link')
      .addEventListener('click', event => event.preventDefault());

    await click('.affiliate-unit__link');

    assert.ok(trackAffiliateUnit.calledOnceWith(simpleUnit, {
      action: trackActions.click,
      category: 'affiliate_incontent_recommend',
      label: 'only-item',
    }));
  });
});
