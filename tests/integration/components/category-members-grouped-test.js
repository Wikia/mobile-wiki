import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import sinon from 'sinon';
import trackModule, { trackActions } from 'mobile-wiki/utils/track';

module('Integration | Component | category-members-grouped', function(hooks) {
  setupRenderingTest(hooks);

  const articleWithImageModel = EmberObject.create({
    "firstChar": "P",
    "members": [
      {
        "image": "https://vignette.wikia.nocookie.net/gameofthrones/images/2/23/108_TPE.jpg/revision/latest/window-crop/width/40/x-offset/129/y-offset/0/window-width/769/window-height/576?cb=20170526150730",
        "isCategory": false,
        "title": "The Pointy End",
        "url": "/wiki/The_Pointy_End"
      }
    ],
    "isCollapsed": false
  });

  const articleWithNoImageModel = EmberObject.create({
    "firstChar": "P",
    "members": [
      {
        "image": null,
        "isCategory": false,
        "title": "Season 1 cast",
        "url": "/wiki/Season_1_cast"
      },
    ],
    "isCollapsed": false
  });

  const subCategoryModel = EmberObject.create({
    "firstChar": "P",
    "members": [
      {
        "image": null,
        "isCategory": true,
        "title": "Season 1 Episodes",
        "url": "/wiki/Category:Season_1_Episodes"
      },
    ],
    "isCollapsed": false
  });

  let trackStub;

  hooks.beforeEach(function () {
    this.owner.register('service:fastboot', Service.extend({ isFastBoot: false }));
    this.owner.register('service:i18n', Service.extend({ t: key => key }));

    trackStub = sinon.stub(trackModule, 'track');
  });

  hooks.afterEach(() => {
    trackStub.restore();
  });

  test('renders category member with image', async function(assert) {
    assert.expect(5);

    this.set('model',[articleWithImageModel]);

    await render(hbs`<CategoryMembersGrouped @model={{this.model}} />`);

    assert.dom('.category-members-grouped__first-char', this.element).hasText(articleWithImageModel.firstChar);

    assert.dom('.category-members-grouped__member-left > .category-members-grouped__member-thumbnail', this.element).hasAttribute('data-src', articleWithImageModel.members[0].image);
    assert.dom('.category-members-grouped__member-left > .category-members-grouped__member-thumbnail', this.element).hasAttribute('alt', articleWithImageModel.members[0].title);

    assert.dom('.category-members-grouped__member-link', this.element).hasAttribute('href', articleWithImageModel.members[0].url);
    assert.dom('.category-members-grouped__member-link', this.element).hasText(articleWithImageModel.members[0].title);
  });

  test('renders category member with image on client side without noscript fallback', async function(assert) {
    assert.expect(1);

    this.set('model',[articleWithImageModel]);

    await render(hbs`<CategoryMembersGrouped @model={{this.model}} />`);


    assert.dom('.category-members-grouped__member-left > noscript > .category-members-grouped__member-thumbnail', this.element).doesNotExist();
  });

  test('renders category member with image in SSR with noscript fallback', async function(assert) {
    assert.expect(2);

    // XXX: clear any existing cached fastboot service instances
    this.owner.unregister('service:fastboot');
    this.owner.register('service:fastboot', Service.extend({ isFastBoot: true }));

    this.set('model',[articleWithImageModel]);

    await render(hbs`<CategoryMembersGrouped @model={{this.model}} />`);

    assert.dom('.category-members-grouped__member-left > noscript > .category-members-grouped__member-thumbnail', this.element).hasAttribute('src', articleWithImageModel.members[0].image);
    assert.dom('.category-members-grouped__member-left > noscript > .category-members-grouped__member-thumbnail', this.element).hasAttribute('alt', articleWithImageModel.members[0].title);
  });

  test('renders category member with no image', async function(assert) {
    assert.expect(1);

    this.set('model',[articleWithNoImageModel]);

    await render(hbs`<CategoryMembersGrouped @model={{this.model}} />`);

    assert.dom('.category-members-grouped__member-thumbnail', this.element).doesNotExist();
  });

  test('renders subcategory', async function(assert) {
    assert.expect(1);

    this.set('model',[subCategoryModel]);

    await render(hbs`<CategoryMembersGrouped @model={{this.model}} />`);

    assert.dom('svg', this.element).exists();
  });

  test('renders with no members', async function(assert) {
    assert.expect(3);

    this.set('model', []);

    await render(hbs`<CategoryMembersGrouped @model={{this.model}} />`);

    assert.dom('.category-members-grouped__first-char', this.element).doesNotExist();
    assert.dom('.category-members-grouped__members-for-char', this.element).doesNotExist();

    assert.dom(this.element).hasText('main:category-page.no-members');
  });

  test('toggles group visibility on group header click', async function(assert) {
    assert.expect(3);

    this.set('model',[subCategoryModel]);

    await render(hbs`<CategoryMembersGrouped @model={{this.model}} />`);

    assert.dom('.category-members-grouped__first-char', this.element).hasNoClass('is-collapsed');

    await click('.category-members-grouped__first-char');

    assert.dom('.category-members-grouped__first-char', this.element).hasClass('is-collapsed');

    await click('.category-members-grouped__first-char');

    assert.dom('.category-members-grouped__first-char', this.element).hasNoClass('is-collapsed');
  });

  test('calls trackClick when member link clicked', async function(assert) {
    assert.expect(1);

    this.set('model', [articleWithImageModel]);

    await render(hbs`<CategoryMembersGrouped @model={{this.model}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('a')
      .addEventListener('click', event => event.preventDefault());

    await click('.category-members-grouped__member-link');

    assert.ok(trackStub.calledOnceWith({
      action: trackActions.click,
      category: 'category-page',
      label: 'open-link',
    }));
  });
});
