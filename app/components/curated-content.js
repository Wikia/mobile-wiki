import Component from '@ember/component';
import { action } from '@ember/object';
import scrollToTop from '../utils/scroll-to-top';

export default Component.extend({
  classNames: ['curated-content', 'mw-content'],
  activeLabel: null,

  /**
   * @param {CuratedContentItem} item
   * @returns {void}
   */
  @action
  openSection(item) {
    this.set('activeLabel', item.label);
    scrollToTop(this.element);
  },

  @action
  closeSection(event) {
    event.preventDefault();
    this.set('activeLabel', null);
  },
});
