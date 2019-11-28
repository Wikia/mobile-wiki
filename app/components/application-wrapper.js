import Component from '@ember/component';
import { bool, readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isHashLink } from '../utils/url';
import { track } from '../utils/track';

/**
  * HTMLMouseEvent
  * @typedef {Object} HTMLMouseEvent
  * @extends {MouseEvent}
  * @property {HTMLElement} target
*/

/**
  * DOMStringMap
  * @typedef {Object} DOMStringMap
  * @property {string} galleryRef
  * @property {string} ref
  * @property {string} trackingCategory
*/

/**
  * EventTarget
  * @typedef {Object} EventTarget
  * @property {string} tagName
*/

export default Component.extend({
  // ads: service('ads/ads'),
  currentUser: service(),
  smartBanner: service(),
  lightbox: service(),
  logger: service(),
  wikiVariables: service(),

  classNames: ['application-wrapper'],
  classNameBindings: [
    'smartBannerVisible',
    'isFandomAppSmartBannerVisible:with-smart-banner',
    'isCustomSmartBannerVisible:with-smart-banner',
    // 'bfaaTemplate',
    'fullPage:is-full-page',
    'isDarkTheme',
  ],
  scrollLocation: null,
  smartBannerVisible: readOnly('smartBanner.smartBannerVisible'),
  shouldShowFandomAppSmartBanner: readOnly('smartBanner.shouldShowFandomAppSmartBanner'),
  isFandomAppSmartBannerVisible: readOnly('smartBanner.isFandomAppSmartBannerVisible'),
  isCustomSmartBannerVisible: readOnly('smartBanner.isCustomSmartBannerVisible'),

  // bfaaTemplate: bool('ads.siteHeadOffset'),
  contentLanguage: readOnly('wikiVariables.language.content'),
  isWikiaOrg: readOnly('globalFooter.is-wikia-org'),

  track(data) {
    track(data);
  },

  /**
  * Necessary because presently, we open external links in new pages, so if we didn't
  * cancel the click event on the current page, then the mouseUp handler would open
  * the external link in a new page _and_ the current page would be set to that external link.
  *
  * @param {MouseEvent} event
  * @returns {void}
  */
  click(event) {
    /**
   * check if the target has a parent that is an anchor
   * We do this for links in the form <a href='...'>Blah <i>Blah</i> Blah</a>,
   * because if the user clicks the part of the link in the <i></i> then
   * target.tagName will register as 'I' and not 'A'.
   */
    const anchor = event.target.closest('a');
    const target = anchor || event.target;
    let tagName;

    if (target && this.shouldHandleClick(target)) {
      tagName = target.tagName.toLowerCase();

      if (tagName === 'a' && !isHashLink(target)) {
        this.handleLink(target);
        event.preventDefault();
      }
    }
  },

  /**
  * Determine if we have to apply special logic to the click handler for MediaWiki / UGC content
  *
  * @param {Element} target
  * @returns {boolean}
  */
  shouldHandleClick(target) {
    const isReference = this.targetIsReference(target);

    return (
      target.closest('.mw-content')
      // ignore polldaddy content
      && !target.closest('.PDS_Poll')
      // don't need special logic for article references
      && !isReference
    );
  },

  /**
  * Determine if the clicked target is an reference/in references list (in text or at the bottom
  * of article)
  *
  * @param {Element} target
  * @returns {boolean}
  */
  targetIsReference(target) {
    return Boolean(
      target.closest('.references')
   || (target.parentNode && target.parentNode.matches('.reference')),
    );
  },

  /**
  * @param {HTMLAnchorElement|EventTarget} target
  * @returns {void}
  */
  handleLink(target) {
    this.logger.debug('Handling link with href:', target.href);

    /**
   * If either the target or the target's parent is an anchor (and thus target == true),
   * then also check if the anchor has an href. If it doesn't we assume there is some other
   * handler for it that deals with it based on ID or something and we just skip it.
   */
    if (target && target.href) {
      /**
    * But if it does have an href, we check that it's not the link to expand the comments
    * If it's _any_ other link than that comments link, we stop its action and
    * pass it up to handleLink
    */
      if (!target.href.match(`^${window.location.origin}/a/.*/comments$`)) {
        this.lightbox.close();
        this.handleLink();
      }
    }
  },
});
