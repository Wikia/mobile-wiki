import Component from '@ember/component';
import { action } from '@ember/object';
import { and, bool, gte } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import LanguagesMixin from '../mixins/languages';
import PortableInfoboxHeroImageMixin from '../mixins/portable-infobox-hero-image';
import { track, trackActions } from '../utils/track';

/**
  * @typedef {Object} ArticleSectionHeader
  * @property {HTMLElement} element
  * @property {string} level
  * @property {string} name
  * @property {string} [id]
  * @property {string} section
*/

export default Component.extend(
  PortableInfoboxHeroImageMixin,
  LanguagesMixin,
  {
    currentUser: service(),
    wikiVariables: service(),

    classNames: ['article-wrapper'],
    classNameBindings: ['hasFeaturedVideo'],
    displayEmptyArticleInfo: true,
    displayArticleWrapper: true,

    showComments: gte('model.comments', 0),
    hasFeaturedVideo: bool('model.featuredVideo'),
    smallHeroImage: and('hasFeaturedVideo', 'heroImage'),

    init() {
      this._super(...arguments);

      this.hammerOptions = {
        touchAction: 'auto',
        cssProps: {
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-touch-callout
         * 'default' displays the callout
         * 'none' disables the callout
         * hammer.js sets it to 'none' by default so we have to override
        */
          touchCallout: 'default',
        },
      };
    },

    @action
    trackClick(category, label) {
      track({
        action: trackActions.click,
        category,
        label,
      });
    },

    @action
    forceFeaturedVideoVisibility() {
      this.set('hasFeaturedVideo', true);
    },
  },
);
