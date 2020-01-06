import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';
import trackModule, { trackActions } from 'mobile-wiki/utils/track';

module('Integration | Component | wikia-ui-components | wiki-page-header-curated-main-page', (hooks) => {
  setupRenderingTest(hooks);

  let trackStub;

  hooks.beforeEach(function () {
    const host = 'starwars.fandom.com';
    const path = '/main/edit';

    const build = sinon.stub().withArgs({ host, path }).returns('#/main/edit');

    this.owner.register('service:wikiVariables', Service.extend({
      mainPageTitle: 'My Main Page',
      siteName: 'Test Wiki',
      host,
    }));
    this.owner.register('service:wikiUrls', Service.extend({ build }));
    this.owner.register('service:i18n', Service.extend({ t: key => key }));

    trackStub = sinon.stub(trackModule, 'track');
  });

  hooks.afterEach(() => {
    trackStub.restore();
  });

  test('renders without buttons', async function (assert) {
    assert.expect(2);

    await render(hbs`<WikiaUiComponents::WikiPageHeaderCuratedMainPage @title="Test Title" />`);

    assert.dom('h1', this.element).hasText('Test Title');
    assert.dom('a', this.element).doesNotExist();
  });

  test('renders with edit button', async function (assert) {
    assert.expect(2);

    this.set('showButtons', true);

    await render(hbs`<WikiaUiComponents::WikiPageHeaderCuratedMainPage @title="Test Title" @showButtons={{this.showButtons}} />`);

    assert.dom('a', this.element).hasAttribute('href', '#/main/edit');
    assert.dom('a', this.element).hasText('main:app.curated-content-editor-edit-main-page');
  });

  test('calls tracker on edit button click', async function (assert) {
    assert.expect(1);

    this.set('showButtons', true);

    await render(hbs`<WikiaUiComponents::WikiPageHeaderCuratedMainPage @title="Test Title" @showButtons={{this.showButtons}} />`);

    await click('.main-page-edit');

    assert.ok(trackStub.calledWith({
      action: trackActions.click,
      category: 'main-page',
      label: 'open-editor',
    }));
  });
});
