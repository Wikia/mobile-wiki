import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import sinon from 'sinon';

module('Integration | Component | lightbox-wrapper', (hooks) => {
  setupRenderingTest(hooks);

  const lightbox = {
    file: 'Bossk-TCW.jpg',
    isVisible: true,
    lightboxType: 'media',
    model: {
      type: 'image',
      url: 'https://vignette.wikia.nocookie.net/starwars/images/e/e8/Bossk-TCW.jpg/revision/latest?cb=20120124004827',
      title: 'Bossk-TCW.jpg',
      isLinkedByUser: false,
      href: 'https://vignette.wikia.nocookie.net/starwars/images/e/e8/Bossk-TCW.jpg/revision/latest?cb=20120124004827',
      isVideo: false,
      width: 920,
      height: 704,
      caption: ' Bossk during the Clone Wars. ',
    },
    noScroll: true,
  };

  test('renders with image', async function (assert) {
    assert.expect(4);

    this.owner.register('service:lightbox', Service.extend(lightbox));

    await render(hbs`<LightboxWrapper />`);

    assert.dom('.lightbox-header > .lightbox-header-title', this.element).hasText('');

    assert.dom('.lightbox-footer .lightbox-footer-content', this.element).hasText(lightbox.model.caption);

    assert.dom('.lightbox-header', this.element).hasNoClass('wds-is-hidden');
    assert.dom('.lightbox-footer', this.element).hasNoClass('wds-is-hidden');
  });

  test('toggles header and footer when content area is clicked', async function (assert) {
    assert.expect(6);

    this.owner.register('service:lightbox', Service.extend(lightbox));

    await render(hbs`<LightboxWrapper />`);

    assert.dom('.lightbox-header', this.element).hasNoClass('wds-is-hidden');
    assert.dom('.lightbox-footer', this.element).hasNoClass('wds-is-hidden');

    await click('.lightbox-content');

    assert.dom('.lightbox-header', this.element).hasClass('wds-is-hidden');
    assert.dom('.lightbox-footer', this.element).hasClass('wds-is-hidden');

    await click('.lightbox-content');

    assert.dom('.lightbox-header', this.element).hasNoClass('wds-is-hidden');
    assert.dom('.lightbox-footer', this.element).hasNoClass('wds-is-hidden');
  });

  test('toggles expanded footer content when clicked', async function (assert) {
    assert.expect(7);

    this.owner.register('service:lightbox', Service.extend(lightbox));

    await render(hbs`<LightboxWrapper />`);

    assert.dom('.lightbox-footer .lightbox-footer-content', this.element).hasNoClass('expanded');

    await click('.lightbox-footer-content');

    assert.dom('.lightbox-footer .lightbox-footer-content', this.element).hasClass('expanded');

    assert.dom('.lightbox-header', this.element).hasNoClass('wds-is-hidden');
    assert.dom('.lightbox-footer', this.element).hasNoClass('wds-is-hidden');

    await click('.lightbox-footer-content');

    assert.dom('.lightbox-footer .lightbox-footer-content', this.element).hasNoClass('expanded');

    assert.dom('.lightbox-header', this.element).hasNoClass('wds-is-hidden');
    assert.dom('.lightbox-footer', this.element).hasNoClass('wds-is-hidden');
  });

  test('closes lightbox when close icon is clicked', async function (assert) {
    assert.expect(1);

    const close = sinon.spy();
    const service = { ...lightbox, close };

    this.owner.register('service:lightbox', Service.extend(service));

    await render(hbs`<LightboxWrapper />`);

    await click('.lightbox-close-wrapper');

    assert.ok(close.calledOnce);
  });
});
