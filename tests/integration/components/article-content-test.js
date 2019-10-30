import Component from '@ember/component';
import { computed } from '@ember/object';
import Service from '@ember/service';
import { dasherize } from '@ember/string';
import { find, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import RenderComponentMixin from 'mobile-wiki/mixins/render-component';
import Ads from 'mobile-wiki/modules/ads';
import { module, test } from 'qunit';
import sinon from 'sinon';
import { getAdsModuleMock, mockAdsService } from '../../helpers/mock-ads-service';

const adSlotComponentStub = Component.extend(RenderComponentMixin, {
  classNameBindings: ['nameLowerCase'],
  nameLowerCase: computed('name', function () {
    return dasherize(this.get('name').toLowerCase());
  }),
});
const i18nService = Service.extend({
  t() {},
});

module('Integration | Component | article content', (hooks) => {
  setupRenderingTest(hooks);
  let adsModuleStub;

  hooks.beforeEach(function () {
    adsModuleStub = sinon.stub(Ads, 'getLoadedInstance').returns(Promise.resolve(getAdsModuleMock()));
    this.owner.register('component:ad-slot', adSlotComponentStub);
    this.owner.register('service:i18n', i18nService);
    mockAdsService(this.owner);
  });

  hooks.afterEach(() => {
    adsModuleStub.restore();
  });

  const topLeaderboardSelector = '.top-leaderboard';

  test('ad is injected below portable infobox with no page header', async function (assert) {
    const content = '<p>some content</p>'
      + '<div class="portable-infobox-wrapper">'
      + '<aside class="portable-infobox"></aside>'
      + '</div>'
      + '<section>Article body</section>'
      + '<div>more content</div>';
    const setupAdsContextSpy = sinon.spy();

    this.setProperties({
      adsContext: {},
      content,
      setupAdsContext: setupAdsContextSpy,
    });

    await render(hbs`{{#article-content
        setupAdsContext=setupAdsContext
        content=content
        adsContext=adsContext
      }}{{/article-content}}`);

    assert.dom(topLeaderboardSelector).exists({ count: 1 });
    assert.equal(
      find(topLeaderboardSelector).previousSibling,
      find('.portable-infobox-wrapper'),
      'previous element is an infobox',
    );
  });

  test('ad is injected below page header', async function (assert) {
    const content = '<p>some content</p>'
      + '<aside class="wiki-page-header"></aside>'
      + '<section>Article body</section>'
      + '<div>more content</div>';
    const setupAdsContextSpy = sinon.spy();

    this.setProperties({
      adsContext: {},
      content,
      setupAdsContext: setupAdsContextSpy,
    });

    await render(hbs`{{#article-content
        setupAdsContext=setupAdsContext
        content=content
        adsContext=adsContext
      }}{{/article-content}}`);

    assert.dom(topLeaderboardSelector).exists({ count: 1 });
    assert.equal(
      find(topLeaderboardSelector).previousSibling,
      find('.wiki-page-header'),
      'previous element is site header',
    );
  });

  test('ad is injected below portable infobox', async function (assert) {
    const content = '<p>some content</p>'
      + '<div class="wiki-page-header"></div>'
      + '<div class="portable-infobox-wrapper">'
      + '<aside class="portable-infobox"></aside>'
      + '</div>'
      + '<section>Article body</section>'
      + '<div>more content</div>';
    const setupAdsContextSpy = sinon.spy();

    this.setProperties({
      adsContext: {},
      content,
      setupAdsContext: setupAdsContextSpy,
    });

    await render(hbs`{{#article-content
        setupAdsContext=setupAdsContext
        content=content
        adsContext=adsContext
      }}{{/article-content}}`);

    assert.dom(topLeaderboardSelector).exists({ count: 1 }, 'top leaderboard is inserted only once');
    assert.equal(
      find(topLeaderboardSelector).previousSibling,
      find('.portable-infobox-wrapper'),
      'previous element is an infobox',
    );
  });
});
