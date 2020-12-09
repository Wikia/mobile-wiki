import Component from '@ember/component';
import { equal, readOnly } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import HeadroomMixin from '../mixins/headroom';
import { standalone } from '../utils/browser';
import { track, trackActions } from '../utils/track';
import Ads from '../modules/ads';

export default Component.extend(
  HeadroomMixin,
  {
    ads: service('ads/ads'),
    currentUser: service(),
    smartBanner: service(),
    router: service(),
    wikiVariables: service(),

    classNames: ['site-head-container'],
    classNameBindings: ['themeBar', 'partnerSlot:has-partner-slot'],
    tagName: 'div',
    themeBar: false,
    offset: 0,

    partnerSlot: readOnly('globalNavigation.partner-slot'),
    smartBannerVisible: readOnly('smartBanner.smartBannerVisible'),
    shouldShowFandomAppSmartBanner: readOnly('smartBanner.shouldShowFandomAppSmartBanner'),
    isFandomAppSmartBannerVisible: readOnly('smartBanner.isFandomAppSmartBannerVisible'),
    isCustomSmartBannerVisible: readOnly('smartBanner.isCustomSmartBannerVisible'),
    canShowContentRecommendations: equal('contentLanguage', 'en'),

    init() {
      this._super(...arguments);
      this.headroomOptions = {
        classes: {
          initial: 'site-head-headroom',
          pinned: 'site-head-headroom-pinned',
          unpinned: 'site-head-headroom-un-pinned',
          top: 'site-head-headroom-top',
          notTop: 'site-head-headroom-not-top',
        },
      };

      // Hacky way to distinct UCP and App wikis as enableHydraFeatures is available only on UCP
      const isUcpWiki = this.get('wikiVariables.enableHydraFeatures') !== undefined;
      this.set('showSearchScope', isUcpWiki);
    },

    /**
   * @returns {void}
   */
    willInsertElement() {
      if (this.shouldShowFandomAppSmartBanner) {
        // this HAS TO be run while rendering, but it cannot be run on didInsert/willInsert
        // running this just after render is working too
        run.scheduleOnce('afterRender', this, this.checkForHiding);
      }
    },

    /**
   * @returns {void}
   */
    checkForHiding() {
      if (!standalone
        && !this.smartBanner.isCookieSet(this.smartBanner.fandomAppCookieName)
        && !this.smartBanner.isCookieSet(this.smartBanner.customCookieName)) {
        this.smartBanner.setVisibility(true);
      }

      if (!standalone && !this.smartBanner.isCookieSet(this.smartBanner.fandomAppCookieName)) {
        this.smartBanner.track(trackActions.impression, this.smartBanner.fandomAppCookieName);
      }

      if (!standalone && !this.smartBanner.isCookieSet(this.smartBanner.customCookieName)) {
        this.smartBanner.track(trackActions.impression, this.smartBanner.customCookieName);
      }
    },

    track(data) {
      track(data);
    },

    onModalOpen() {
      Ads.getLoadedInstance()
        .then(ads => ads.onMenuOpen())
        .catch(() => {}); // Ads not loaded.
    },

    getSearchTrackingBasePayload(suggestions, suggestionsSearchId) {
      return {
        enteredPhrase: suggestions[0].query,
        suggestions: suggestions.map(suggestion => ({
          type: 'article',
          value: suggestion.title,
          id: suggestion.articleId,
        })),
        app: 'mw-mobile',
        siteId: this.wikiVariables.id,
        suggestionId: suggestionsSearchId,
        pvUniqueId: window.pvUID,
      };
    },

    trackSearchSuggestionClick(clickedSuggestion, displayedSuggestions, suggestionSearchId) {
      const payload = Object.assign(
        this.getSearchTrackingBasePayload(displayedSuggestions, suggestionSearchId),
        { positionOfClickedItem: displayedSuggestions.indexOf(clickedSuggestion) + 1 },
      );

      M.trackingQueue.push(() => window.searchTracking.trackSuggestClicked(payload));
    },

    trackSearchSuggestionsImpression(suggestions, suggestionsSearchId) {
      const payload = this.getSearchTrackingBasePayload(suggestions, suggestionsSearchId);

      M.trackingQueue.push(() => window.searchTracking.trackSuggestImpression(payload));
    },

    onSearchSuggestionChosen(clickedSuggestion, displayedSuggestions, suggestionsSearchId) {
      const { uri } = clickedSuggestion;

      this.trackSearchSuggestionClick(clickedSuggestion, displayedSuggestions, suggestionsSearchId);
      this.router.transitionTo('wiki-page', uri);
    },

    onSearchSuggestionsImpression(suggestions, suggestionsSearchId) {
      this.trackSearchSuggestionsImpression(suggestions, suggestionsSearchId);
    },

    goToSearchResults(value, scope = null) {
      this.router.transitionTo('search', {
        queryParams: {
          query: value,
          scope: scope === 'cross-wiki' ? 'cross-wiki' : 'internal',
        },
      });
    },

    onLinkClicked(href, event) {
      event.preventDefault();

      if (href.substr(0, 6) === '/wiki/') {
        this.router.transitionTo('wiki-page', href.substr(6));
      } else {
        window.location = href;
      }
    },
  },
);
