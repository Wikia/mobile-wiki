import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';

module('Integration | Component | category-pagination', (hooks) => {
  setupRenderingTest(hooks);

  const secondPageModel = {
    isPrevPageTheFirstPage: true,
    firstPageUrl: null,
    prevPageKey: ' \nHuman',
    prevPageUrl: 'https://starwars.fandom.com/wiki/Humans',
    nextPageKey: 'Argoe, Vleen\nVleen Argoe',
    nextPageUrl: 'https://starwars.fandom.com/wiki/Humans?from=Argoe%2C+Vleen%0AVleen+Argoe',
    lastPageKey: 'Zavict, Abram\nAbram Zavict',
    lastPageUrl: 'https://starwars.fandom.com/wiki/Humans?from=Zavict%2C+Abram%0AAbram+Zavict',
  };

  const intermediatePageModel = {
    isPrevPageTheFirstPage: false,
    firstPageUrl: 'https://starwars.fandom.com/wiki/Humans',
    prevPageKey: 'Alora',
    prevPageUrl: 'https://starwars.fandom.com/wiki/Humans?from=Alora',
    nextPageKey: 'Badeleg, Cho\nCho Badeleg',
    nextPageUrl: 'https://starwars.fandom.com/wiki/Humans?from=Badeleg%2C+Cho%0ACho+Badeleg',
    lastPageKey: 'Zavict, Abram\nAbram Zavict',
    lastPageUrl: 'https://starwars.fandom.com/wiki/Humans?from=Zavict%2C+Abram%0AAbram+Zavict',
  };

  hooks.beforeEach(function () {
    this.owner.register('service:i18n', Service.extend({ t: key => key }));
  });

  test('renders on first page with next page and last page links', async function (assert) {
    assert.expect(3);

    const model = {
      isPrevPageTheFirstPage: false,
      firstPageUrl: null,
      prevPageKey: null,
      prevPageUrl: null,
      nextPageKey: 'Alora',
      nextPageUrl: 'http://starwars.fandom.com/wiki/Category:Humans?from=Alora',
      lastPageKey: 'Zavict, Abram\nAbram Zavict',
      lastPageUrl: 'http://starwars.fandom.com/wiki/Category:Humans?from=Zavict%2C+Abram%0AAbram+Zavict',
    };

    this.setProperties({
      model,
      loadFrom: () => {},
    });

    await render(hbs`<CategoryPagination @model={{this.model}} @loadFrom={{this.loadFrom}} />`);

    assert.dom('a', this.element).exists({ count: 2 });

    assert.dom('a.category-pagination__next', this.element).hasAttribute('href', model.nextPageUrl);
    assert.dom('a:last-child', this.element).hasAttribute('href', model.lastPageUrl);
  });

  test('renders on second page with prev page, next page and last page links', async function (assert) {
    assert.expect(4);

    this.setProperties({
      model: secondPageModel,
      loadFrom: () => {},
    });

    await render(hbs`<CategoryPagination @model={{this.model}} @loadFrom={{this.loadFrom}} />`);

    assert.dom('a', this.element).exists({ count: 3 });

    assert.dom('a.category-pagination__prev', this.element).hasAttribute('href', secondPageModel.prevPageUrl);
    assert.dom('a.category-pagination__next', this.element).hasAttribute('href', secondPageModel.nextPageUrl);
    assert.dom('a:last-child', this.element).hasAttribute('href', secondPageModel.lastPageUrl);
  });

  test('renders on intermediate page with first page, prev page, next page and last page links', async function (assert) {
    assert.expect(5);

    this.setProperties({
      model: intermediatePageModel,
      loadFrom: () => {},
    });

    await render(hbs`<CategoryPagination @model={{this.model}} @loadFrom={{this.loadFrom}} />`);

    assert.dom('a', this.element).exists({ count: 4 });

    assert.dom('a:first-child', this.element).hasAttribute('href', intermediatePageModel.firstPageUrl);
    assert.dom('a.category-pagination__prev', this.element).hasAttribute('href', intermediatePageModel.prevPageUrl);
    assert.dom('a.category-pagination__next', this.element).hasAttribute('href', intermediatePageModel.nextPageUrl);
    assert.dom('a:last-child', this.element).hasAttribute('href', intermediatePageModel.lastPageUrl);
  });

  test('renders on penultimate page with first page, prev page and next page links', async function (assert) {
    assert.expect(4);

    const model = {
      isPrevPageTheFirstPage: false,
      firstPageUrl: 'https://starwars.fandom.com/wiki/Humans',
      prevPageKey: 'Westerli',
      prevPageUrl: 'https://starwars.fandom.com/wiki/Humans?from=Westerli',
      nextPageKey: 'Zavict, Abram\nAbram Zavict',
      nextPageUrl: 'https://starwars.fandom.com/wiki/Humans?from=Zavict%2C+Abram%0AAbram+Zavict',
      lastPageKey: 'Zavict, Abram\nAbram Zavict',
      lastPageUrl: null,
    };

    this.setProperties({
      model,
      loadFrom: () => {},
    });

    await render(hbs`<CategoryPagination @model={{this.model}} @loadFrom={{this.loadFrom}} />`);

    assert.dom('a', this.element).exists({ count: 3 });

    assert.dom('a:first-child', this.element).hasAttribute('href', model.firstPageUrl);
    assert.dom('a.category-pagination__prev', this.element).hasAttribute('href', model.prevPageUrl);
    assert.dom('a:last-child', this.element).hasAttribute('href', model.nextPageUrl);
  });

  test('calls loadFrom with empty key on second page when previous button clicked', async function (assert) {
    assert.expect(1);

    const loadFrom = sinon.spy();

    this.setProperties({
      model: secondPageModel,
      loadFrom,
    });

    await render(hbs`<CategoryPagination @model={{this.model}} @loadFrom={{this.loadFrom}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('a.category-pagination__prev')
      .addEventListener('click', event => event.preventDefault());

    await click('a.category-pagination__prev');

    assert.ok(loadFrom.calledOnceWith(null, 'prev'));
  });

  test('calls loadFrom with empty key on intermediate page when first page button clicked', async function (assert) {
    assert.expect(1);

    const loadFrom = sinon.spy();

    this.setProperties({
      model: intermediatePageModel,
      loadFrom,
    });

    await render(hbs`<CategoryPagination @model={{this.model}} @loadFrom={{this.loadFrom}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('a:first-child')
      .addEventListener('click', event => event.preventDefault());

    await click('a:first-child');

    assert.ok(loadFrom.calledOnceWith(null, 'first'));
  });

  test('calls loadFrom with previous page key on intermediate page when previous button clicked', async function (assert) {
    assert.expect(1);

    const loadFrom = sinon.spy();

    this.setProperties({
      model: intermediatePageModel,
      loadFrom,
    });

    await render(hbs`<CategoryPagination @model={{this.model}} @loadFrom={{this.loadFrom}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('a.category-pagination__prev')
      .addEventListener('click', event => event.preventDefault());

    await click('a.category-pagination__prev');

    assert.ok(loadFrom.calledOnceWith(intermediatePageModel.prevPageKey, 'prev'));
  });

  test('calls loadFrom with previous page key on intermediate page when next button clicked', async function (assert) {
    assert.expect(1);

    const loadFrom = sinon.spy();

    this.setProperties({
      model: intermediatePageModel,
      loadFrom,
    });

    await render(hbs`<CategoryPagination @model={{this.model}} @loadFrom={{this.loadFrom}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('a.category-pagination__next')
      .addEventListener('click', event => event.preventDefault());

    await click('a.category-pagination__next');

    assert.ok(loadFrom.calledOnceWith(intermediatePageModel.nextPageKey, 'next'));
  });

  test('calls loadFrom with last page key on intermediate page when last page button clicked', async function (assert) {
    assert.expect(1);

    const loadFrom = sinon.spy();

    this.setProperties({
      model: intermediatePageModel,
      loadFrom,
    });

    await render(hbs`<CategoryPagination @model={{this.model}} @loadFrom={{this.loadFrom}} />`);

    // Hack: prevent navigating away when link is clicked
    this.element.querySelector('a:last-child')
      .addEventListener('click', event => event.preventDefault());

    await click('a:last-child');

    assert.ok(loadFrom.calledOnceWith(intermediatePageModel.lastPageKey, 'last'));
  });
});
