import { alias, not, or } from '@ember/object/computed';
import { action, computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  lightbox: service(),

  classNames: ['lightbox-wrapper', 'wds-font-size-xs', 'wds-leading-tight'],
  classNameBindings: ['isVisible:open', 'uiHidden:lightbox-ui-hidden', 'hasFooter:has-footer'],
  // This is needed for keyDown event to work
  attributeBindings: ['tabindex'],
  tabindex: 0,

  closeButtonHidden: false,
  footerExpanded: false,
  footer: null,
  footerHead: '',
  footerLink: null,
  header: null,
  uiHidden: false,
  thumbnails: null,
  displayFilmstrip: false,

  isVisible: alias('lightbox.isVisible'),
  lightboxCloseButtonDelay: alias('lightbox.closeButtonDelay'),
  type: alias('lightbox.lightboxType'),
  model: alias('lightbox.model'),

  closeAllowed: not('closeButtonHidden'),
  hasFooter: or('footer', 'footerHead', 'footerLink'),

  lightboxComponent: computed('type', function () {
    const type = this.type;

    return type ? `lightbox-${type}` : null;
  }),

  /**
   * @returns {void}
   */
  @action
  close() {
    if (!this.closeAllowed) {
      return;
    }

    this.setProperties({
      footer: null,
      footerHead: '',
      footerLink: null,
      header: null,
      footerExpanded: false,
      uiHidden: false,
      thumbnails: null,
      closeButtonHidden: false,
      displayFilmstrip: false,
    });

    this.lightbox.close();
  },

  /**
   * @param {string} footer
   * @param {string} footerHead
   * @param {string} footerLink
   * @returns {void}
   */
  @action
  setFooter(footer, footerHead, footerLink) {
    this.set('footer', footer);
    this.set('footerHead', footerHead);
    this.set('footerLink', footerLink);
  },

  /**
   * @param {string} header
   * @returns {void}
   */
  @action
  setHeader(header) {
    this.set('header', header);
  },

  /**
   * @param {boolean} hidden
   * @returns {void}
   */
  @action
  setCloseButtonHidden(hidden) {
    this.set('closeButtonHidden', hidden);
  },

  /**
   * @param {array} thumbnails: array of thumb urls
   */
  @action
  setThumbnails(thumbnails) {
    this.set('thumbnails', thumbnails);
    this.set('displayFilmstrip', !!thumbnails);
  },

  /**
   * @returns {void}
   */
  @action
  toggleFooter() {
    this.toggleProperty('footerExpanded');
  },

  /**
   * @returns {void}
   */
  @action
  toggleUI() {
    this.toggleProperty('uiHidden');
  },

  @action
  updateGalleryRef(value) {
    this.set('model.galleryRef', value);
  },

  /**
  * @param {MouseEvent} event
  * @returns {void}
  */
  click(event) {
    const target = event.target;

    if (target.classList.contains('lightbox-footer-content')) {
      this.send('toggleFooter');
    } else if (target.classList.contains('lightbox-close-wrapper')) {
      this.send('close');
    } else {
      this.send('toggleUI');
    }
  },

  /**
  * @param {KeyboardEvent} event
  * @returns {void}
  */
  keyDown(event) {
    if (this.closeAllowed && event.keyCode === 27) {
      this.send('close');
    }
  },
});
