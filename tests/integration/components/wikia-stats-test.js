import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';
import trackModule, { trackActions } from 'mobile-wiki/utils/track';

module('Integration | Component | wikia-stats', (hooks) => {
  setupRenderingTest(hooks);

  const model = {
    edits: 301,
    articles: 29,
    pages: 178,
    users: 21779557,
    activeUsers: 4,
    images: 18,
    videos: 3,
    admins: 1,
    discussions: 1124,
  };

  let trackStub;

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
    trackStub = sinon.stub(trackModule, 'track');
  });

  hooks.afterEach(() => {
    trackStub.restore();
  });

  test('renders item list', async function (assert) {
    assert.expect(7);

    this.set('model', model);

    await render(hbs`<WikiaStats @model={{this.model}} />`);

    assert.dom('.wikia-stats-container > .wikia-stats-item', this.element).exists({ count: 4 });

    assert.dom('.wikia-stats-container > .wikia-stats-item:nth-child(1) > .wikia-stats-value').hasText(`${model.articles}`);
    assert.dom('.wikia-stats-container > .wikia-stats-item:nth-child(2) > .wikia-stats-value').hasText(`${model.images}`);
    assert.dom('.wikia-stats-container > .wikia-stats-item:nth-child(3) > .wikia-stats-value').hasText(`${model.videos}`);
    assert.dom('.wikia-stats-container > .wikia-stats-item:nth-child(4) > .wikia-stats-link > .wikia-stats-value').hasText('1k');

    assert.dom('.wikia-stats-container > .wikia-stats-item > .wikia-stats-link').exists({ count: 1 });
    assert.dom('.wikia-stats-container > .wikia-stats-item > .wikia-stats-link').hasAttribute('href', '/d/f');
  });

  test('calls tracker when discussions link is clicked', async function (assert) {
    assert.expect(1);

    this.set('model', model);

    await render(hbs`<WikiaStats @model={{this.model}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('.wikia-stats-container > .wikia-stats-item > .wikia-stats-link')
      .addEventListener('click', event => event.preventDefault());

    await click('.wikia-stats-container > .wikia-stats-item > .wikia-stats-link');

    assert.ok(trackStub.calledOnceWith({
      action: trackActions.click,
      category: 'main-page',
      label: 'discussions-clicked',
    }));
  });
});
