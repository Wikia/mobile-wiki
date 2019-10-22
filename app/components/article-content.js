import Component from '@ember/component';
import { observer } from '@ember/object';
import { reads } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isBlank, isEmpty } from '@ember/utils';
import Ads from '../modules/ads';
import {
  getRenderComponentFor,
  queryPlaceholders,
} from '../utils/render-component';
import scrollToTop from '../utils/scroll-to-top';
import toArray from '../utils/toArray';
import { track, trackActions } from '../utils/track';

/**
  * HTMLElement
  * @typedef {Object} HTMLElement
  * @property {Function} scrollIntoViewIfNeeded
*/

export default Component.extend(
  {
    adSlotBuilder: service('ads/ad-slot-builder'),
    ads: service('ads/ads'),
    fastboot: service(),
    i18n: service(),
    logger: service(),
    lightbox: service(),
    wikiVariables: service(),
    affiliateSlots: service(),

    tagName: 'article',
    classNames: ['article-content', 'mw-content'],
    attributeBindings: ['lang', 'dir'],
    adsContext: null,
    content: null,
    displayEmptyArticleInfo: true,
    displayTitle: null,
    isPreview: false,
    media: null,

    lang: reads('wikiVariables.language.content'),
    dir: reads('wikiVariables.language.contentDir'),
    isFastBoot: reads('fastboot.isFastBoot'),

    /* eslint ember/no-on-calls-in-components:0 */
    articleContentObserver: on('didInsertElement', observer('content', function () {
      // Our hacks don't work in FastBoot, so we just inject raw HTML in the template
      if (this.isFastBoot) {
        return;
      }

      this.destroyChildComponents();

      run.scheduleOnce('afterRender', this, () => {
        const rawContent = this.content;

        if (!isBlank(rawContent)) {
          this.hackIntoEmberRendering(rawContent);

          this.handleBigAffiliateUnit(this.displayTitle);
          this.handlePostSearchResults(this.displayTitle);
          this.handleWatchShow();
          this.handleInfoboxes();
          this.replaceInfoboxesWithInfoboxComponents();

          this.renderDataComponents(this.element);

          this.loadIcons();
          this.handleTables();
          this.replaceWikiaWidgetsWithComponents();
          this.handleWikiaWidgetWrappers();
          this.handleJumpLink();
          this.handleCollapsibleSections();
          this.handleCategoryPaginationUrls();

          window.lazySizes.init();
        } else if (this.displayEmptyArticleInfo) {
          this.hackIntoEmberRendering(`<p>${this.i18n.t('article.empty-label')}</p>`);
        }

        if (!this.isPreview && this.adsContext) {
          Ads.waitForAdEngine().then((ads) => {
            this.ads.setupAdsContext(this.adsContext);
            ads.onReady(() => {
              if (!this.isDestroyed) {
                // Uncollapse sections first so that we can insert ads in correct places
                this.uncollapseSections();
                this.adSlotBuilder.injectAds(this);
              }
            });
          });
        }

        this.openLightboxIfNeeded();
      });
    })),

    init() {
      this._super(...arguments);

      this.renderComponent = getRenderComponentFor(this);
      this.renderedComponents = [];
    },

    willDestroyElement() {
      this._super(...arguments);

      this.destroyChildComponents();
    },

    openLightboxIfNeeded() {
      const file = this.get('lightbox.file');

      if (!isEmpty(file)) {
        const figure = this.element.querySelector(`[data-file="${file}"]`);

        if (figure) {
          this.openLightbox(figure);
        }
      }
    },

    click(event) {
      this.handleReferences(event);

      let anchor = event.target.closest('a');

      // TODO: remove after IW-2613 is done
      if (!anchor) {
        anchor = event.target.closest('[aria-controls$="-collapsible-section"]');
      }

      const label = this.getTrackingEventLabel(anchor);

      if (label) {
        track({
          action: trackActions.click,
          category: 'article',
          label,
        });
      }

      if (!this.handleInfoboxClick(event)
        || !this.handleImageClick(event)
        || !this.handleGalleryViewMore(event)
      ) {
        return false;
      }

      return undefined;
    },

    handleInfoboxClick(event) {
      const newActiveToggle = event.target.closest('.pi-section-tab');

      if (newActiveToggle) {
        const panel = event.target.closest('.pi-panel');
        const newRef = newActiveToggle.getAttribute('data-ref');
        const currentActiveToggle = panel.querySelector('.pi-section-tab.pi-section-active');
        const currentActiveContent = panel.querySelector('.pi-section-content.pi-section-active');
        const newActiveContent = panel.querySelector(`.pi-section-content[data-ref="${newRef}"]`);

        currentActiveToggle.classList.remove('pi-section-active');
        currentActiveContent.classList.remove('pi-section-active');

        newActiveToggle.classList.add('pi-section-active');
        newActiveContent.classList.add('pi-section-active');

        return false;
      }

      return true;
    },

    handleImageClick(event) {
      const figure = event.target.closest('figure:not(.is-ogg)');
      const figCaption = event.target.closest('figcaption');

      if (figure && !figCaption) {
        this.openLightbox(figure);

        return false;
      }

      return true;
    },

    openLightbox(figure) {
      const gallery = figure.closest('.article-media-gallery, .gallery');

      let lightboxModel;

      if (gallery) {
        lightboxModel = {
          items: this.getLightboxModel(gallery),
          galleryRef: parseInt(figure.getAttribute('data-ref'), 10),
        };
      } else {
        const figcaption = figure.querySelector('figcaption');

        lightboxModel = this.getLightboxModel(figure);
        if (figcaption) {
          // for single images, caption stored within data-attrs attribute contains not fully
          // parsed links, therefore it is better to get it directly from html. For galleries
          // it is not the case
          lightboxModel.caption = figcaption.innerHTML;
        }
      }

      this.lightbox.open('media', lightboxModel);
    },

    getLightboxModel(elem) {
      let lightboxModel;

      try {
        lightboxModel = JSON.parse(elem.getAttribute('data-attrs'));
      } catch (e) {
        this.logger.error('error while loading media model', e);
        lightboxModel = {};
      }

      return lightboxModel;
    },

    handleGalleryViewMore(event) {
      const button = event.target.closest('.article-media-gallery__view-more');

      if (button) {
        const hiddenRows = Array.from(button.closest('.article-media-gallery').querySelectorAll('.wds-is-hidden'));

        if (hiddenRows.length <= 8) {
          button.classList.add('wds-is-hidden');
        }

        hiddenRows.forEach((el, index) => {
          // 8 rows ~ 20 images
          if (index < 8) {
            el.classList.remove('wds-is-hidden');
          }
        });

        return false;
      }
      return true;
    },

    /**
   * This is due to the fact that we send whole article
   * as an HTML and then we have to modify it in the DOM
   *
   * Ember+Glimmer are not fan of this as they would like to have
   * full control over the DOM and rendering
   *
   * In perfect world articles would come as Handlebars templates
   * so Ember+Glimmer could handle all the rendering
   *
   * @param {string} content - HTML containing whole article
   * @returns {void}
   */
    hackIntoEmberRendering(content) {
      this.element.innerHTML = content;
    },

    /**
   * Native browser implementation of location hash often gets clobbered by custom rendering,
   * so ensure it happens here.
   *
   * @returns {void}
   */
    handleJumpLink() {
      if (window.location.hash) {
        window.location.assign(window.location.hash);
      }
    },

    /**
   * @param {Element} element
   * @returns {string}
   */
    getTrackingEventLabel(element) {
      if (element) {
        // Mind the order -- 'figcaption' check has to be done before '.article-media-thumbnail',
        // as the 'figcaption' is contained in the 'figure' element
        // which has the '.article-media-thumbnail' class.
        if (element.closest('.portable-infobox')) {
          return 'portable-infobox-link';
        }
        if (element.closest('.context-link')) {
          return 'context-link';
        }
        if (element.closest('blockquote')) {
          return 'blockquote-link';
        }
        if (element.closest('figcaption')) {
          return 'caption-link';
        }
        if (element.closest('.article-media-thumbnail')) {
          return 'image-link';
        }
        // TODO: remove after IW-2613 is done
        if (element.closest('[aria-controls$="-collapsible-section"]')) {
          return 'section-toggle';
        }

        return 'regular-link';
      }

      return '';
    },

    /**
   * @returns {void}
   */
    destroyChildComponents() {
      this.renderedComponents.forEach((renderedComponent) => {
        renderedComponent.destroy();
      });

      this.renderedComponents.length = 0;
    },

    /**
   * Creating components for small icons isn't good solution because of performance overhead
   * Putting all icons in HTML isn't good solution neither
   * because there are articles with a lot of them
   * Thus we load them all after the article is rendered
   *
   * @returns {void}
   */
    loadIcons() {
      toArray(this.element.querySelectorAll('.article-media-icon[data-src]')).forEach((element) => {
        element.src = element.getAttribute('data-src');
      });
    },

    /**
   * @returns {void}
   */
    replaceInfoboxesWithInfoboxComponents() {
      toArray(this.element.querySelectorAll('.portable-infobox')).forEach((element, index) => {
        this.renderedComponents.push(
          this.renderComponent({
            name: 'portable-infobox',
            attrs: {
              infoboxHTML: element.innerHTML,
              height: element.offsetHeight,
              pageTitle: this.displayTitle,
              index,
            },
            element,
          }),
        );
      });
    },

    renderDataComponents(element) {
      this.renderedComponents = this.renderedComponents.concat(
        queryPlaceholders(element).map(this.renderComponent),
      );
    },
    /**
   * @returns {void}
   */
    replaceWikiaWidgetsWithComponents() {
      toArray(this.element.querySelectorAll('[data-wikia-widget]')).forEach((element) => {
        this.replaceWikiaWidgetWithComponent(element);
      });
    },

    /**
   * @param {Element} element
   * @returns {void}
   */
    replaceWikiaWidgetWithComponent(element) {
      const widgetData = element.dataset;
      const widgetType = widgetData.wikiaWidget;
      const componentName = this.getWidgetComponentName(widgetType);

      if (componentName) {
        this.renderedComponents.push(
          this.renderComponent({
            name: componentName,
            attrs: {
              data: widgetData,
            },
            element,
          }),
        );
      }
    },

    /**
   * @param {string} widgetType
   * @returns {string|null}
   */
    getWidgetComponentName(widgetType) {
      let componentName;

      switch (widgetType) {
        case 'twitter':
          componentName = 'widget-twitter';
          break;
        case 'vk':
          componentName = 'widget-vk';
          break;
        case 'polldaddy':
          componentName = 'widget-polldaddy';
          break;
        case 'flite':
          componentName = 'widget-flite';
          break;
        case 'apester':
          componentName = 'widget-apester';
          break;
        case 'playbuzz':
          componentName = 'widget-playbuzz';
          break;
        case 'math':
          componentName = 'widget-math';
          break;
        default:
          this.logger.warn(`Can't create widget with type '${widgetType}'`);
          return null;
      }

      return componentName;
    },

    /**
   * @returns {void}
   */
    handleWikiaWidgetWrappers() {
      toArray(this.element.querySelectorAll('script[type="x-wikia-widget"]')).forEach((element) => {
        element.outerHTML = element.innerHTML;
      });
    },

    /**
   * handles expanding long tables, code taken from WikiaMobile
   *
   * @returns {void}
   */
    handleInfoboxes() {
      const shortClass = 'short';
      const infoboxes = this.element.querySelectorAll('table[class*="infobox"] tbody');
      const body = window.document.body;
      const scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

      if (infoboxes.length) {
        toArray(infoboxes)
          .filter(element => element.rows.length > 6)
          .forEach((element) => {
            element.classList.add(shortClass);
            element.insertAdjacentHTML('beforeend',
              '<tr class=infobox-expand><td colspan=2><svg viewBox="0 0 12 7" class="icon">'
       + '<use xlink:href="#chevron"></use></svg></td></tr>');

            element.addEventListener('click', (event) => {
              const target = event.target;

              if (!target.matches('a') && element.classList.toggle(shortClass)) {
                scrollTo.apply(element.querySelector('.infobox-expand'));
              }
            });
          });
      }
    },

    /**
   * Opens a parent section of passed element if it's closed
   * @param {Element} element
   * @returns {void}
   */
    openSection(element) {
      if (element) {
        const section = element.closest('section[id*="section"]');

        if (section) {
          const header = section.previousElementSibling;

          if (header && header.nodeName === 'H2') {
            header.classList.add('open-section');
          }
        }
      }
    },

    /**
   * Handles opening sections when click event occurs on references
   * @param {MouseEvent} event
   * @returns {void}
   */
    handleReferences(event) {
      const { target } = event;
      const citeNoteSelector = '#cite_note-';
      const citeRefSelector = '#cite_ref-';

      if (target.nodeName === 'A'
    && (target.hash.startsWith(citeNoteSelector) || target.hash.startsWith(citeRefSelector))
      ) {
        event.preventDefault();
        const reference = this.element.querySelector(target.hash.replace(/([.:])/g, '\\$1'));

        this.openSection(reference);

        if (reference) {
          scrollToTop(reference);
        }
      }
    },

    /**
   * @returns {void}
   */
    handleTables() {
      const tables = this.element.querySelectorAll('table');

      toArray(tables)
        .filter(table => !table.matches('table table, [class*=infobox], .dirbox, .pi-horizontal-group'))
        .forEach((element) => {
          const originalHTML = element.outerHTML;

          element.outerHTML = `<div class="article-table-wrapper"/>${originalHTML}</div>`;
        });
    },

    handleCollapsibleSectionHeaderClick(event) {
      const header = event.currentTarget;

      this.toogleCollapsibleSection(header);
    },

    toogleCollapsibleSection(header) {
      // Temporary fix for caching issues, it can be removed after all caches expire
      if (!header.hasAttribute('aria-controls')) {
        return;
      }

      const section = header.nextElementSibling;
      let visible = 'false';

      if (header.classList.toggle('open-section')) {
        visible = 'true';

        if (!header.hasAttribute('data-rendered')) {
          this.renderDataComponents(section);
          header.setAttribute('data-rendered', '');
        }
      }

      section.setAttribute('aria-pressed', visible);
      section.setAttribute('aria-expanded', visible);
    },

    handleCollapsibleSections() {
      toArray(this.element.querySelectorAll('h2[section]'))
        .forEach(header => header.addEventListener('click', this.handleCollapsibleSectionHeaderClick.bind(this)));
    },

    uncollapseSections() {
      toArray(this.element.querySelectorAll('h2[section]:not(.open-section)'))
        .forEach(header => this.toogleCollapsibleSection(header));
    },

    /**
     * When users create links to category pages with query params,
     * we block them from being crawlable. Instead of href, we use a data attribute
     * with encoded URL which needs to be handled in JS. It reloads the page
     * because routes/application.js don't know how to handle that.
     * It's ok because users should get rid of old shortcuts anyway
     * and use the built-ones instead of duplicating them.
     */
    handleCategoryPaginationUrls() {
      toArray(this.element.querySelectorAll('a[data-category-url-encoded]'))
        .forEach(anchor => anchor.addEventListener('mousedown', (event) => {
          const target = event.currentTarget;
          const url = atob(target.getAttribute('data-category-url-encoded'));

          target.setAttribute('href', url);
        }));
    },

    /**
     * Injects watch show button (IW-1470) just after the first infobox
     */
    handleWatchShow() {
      const infobox = this.element.querySelector('.portable-infobox,.infobox');

      if (infobox) {
        const placeholder = document.createElement('div');
        const wrapper = document.createElement('div');

        wrapper.appendChild(placeholder);
        infobox.insertAdjacentElement('afterend', wrapper);

        this.renderedComponents.push(this.renderComponent({
          name: 'watch-show',
          attrs: {},
          element: placeholder,
        }));
      }
    },

    /**
     * Injects an affiliate unit into the article content
     * @param {string} title
     */
    handleBigAffiliateUnit(title) {
      const unit = this.affiliateSlots.getBigUnitOnPage(title);

      if (typeof unit === 'undefined') {
        // There's no unit to display (not an error)
        return;
      }

      // search for second section
      const h2Elements = this.element.querySelectorAll('h2[section]');

      if (h2Elements[1]) {
        const unitPlaceholder = document.createElement('div');
        const unitWrapper = document.createElement('div');
        unitWrapper.className = 'affiliate-slot';

        unitWrapper.appendChild(unitPlaceholder);
        h2Elements[1].insertAdjacentElement('beforebegin', unitWrapper);

        this.renderedComponents.push(this.renderComponent({
          name: 'affiliate-unit',
          attrs: unit,
          element: unitPlaceholder,
        }));
      }
    },

    /**
     * Injects a post search results into the article content
     * @param {string} title
     */
    handlePostSearchResults(title) {
      const unit = this.affiliateSlots.getSmallUnitOnPage(title);

      if (typeof unit === 'undefined') {
        // There's no unit to display (not an error)
        return;
      }

      // search for 4th section
      const h2Elements = this.element.querySelectorAll('h2[section]');

      if (h2Elements[3]) {
        const unitPlaceholder = document.createElement('div');
        const unitWrapper = document.createElement('div');
        unitWrapper.className = 'affiliate-slot';

        unitWrapper.appendChild(unitPlaceholder);
        h2Elements[3].insertAdjacentElement('beforebegin', unitWrapper);

        this.renderedComponents.push(this.renderComponent({
          name: 'post-search-results',
          attrs: {
            query: title,
            isCrossWiki: true,
            isPageInterrupt: true,
            onlyShowWithAffiliateUnit: true,
          },
          element: unitPlaceholder,
        }));
      }
    },
  },
);
