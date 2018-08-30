import Component from '@ember/component';
import { computed, get, observer } from '@ember/object';
import { not } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import fetch from '../utils/mediawiki-fetch';
import scrollToTop from '../utils/scroll-to-top';
import { track, trackActions } from '../utils/track';

/**
  * Component that displays article comments
*/
export default Component.extend({
  preserveScroll: service(),
  wikiVariables: service(),
  wikiUrls: service(),

  classNames: ['article-comments', 'mw-content'],

  page: null,
  articleId: null,
  commentsCount: null,
  model: null,
  isCollapsed: true,

  comments: null,
  users: null,
  pagesCount: null,

  showComments: not('isCollapsed'),
  prevButtonDisabled: computed('page', function () {
    return parseInt(this.get('page'), 10) === 1;
  }),
  nextButtonDisabled: computed('page', 'pagesCount', function () {
    return parseInt(this.get('page'), 10) >= this.get('pagesCount');
  }),

  /**
    * if articleId changes, resets component state
  */
  articleIdObserver: observer('articleId', function () {
    this.setProperties({
      page: null,
      isCollapsed: true,
      comments: null,
      users: null,
      pagesCount: null,
    });

    this.rerender();
  }),

  /**
   * If we recieved page on didRender
   * that means there is a query param comments_page
   * and we should load comments and scroll to them
   *
   * @returns {void}
  */
  didInsertElement() {
    const page = this.get('page');

    this._super(...arguments);

    if (page !== null) {
      this.set('isCollapsed', false);
      this.fetchComments(parseInt(page, 10));

      scheduleOnce('afterRender', this, () => {
        this.scrollTop();
      });
    }
  },

  actions: {
    /**
      * @returns {void}
    */
    nextPage() {
      const page = parseInt(this.get('page'), 10);

      this.set('preserveScroll.preserveScrollPosition', true);
      this.fetchComments(page + 1);
      this.scrollTop();
    },

    /**
      * @returns {void}
    */
    prevPage() {
      const page = parseInt(this.get('page'), 10);

      this.set('preserveScroll.preserveScrollPosition', true);
      this.fetchComments(page - 1);
      this.scrollTop();
    },

    /**
      * @returns {void}
    */
    toggleComments() {
      const page = this.get('page');

      this.set('preserveScroll.preserveScrollPosition', true);
      this.toggleProperty('isCollapsed');

      if (page !== null) {
        this.set('page', null);
      } else {
        this.fetchComments(1);
      }

      track({
        action: trackActions.click,
        category: 'comments',
        label: this.page ? 'expanded' : 'collapsed',
      });
    },
  },

  scrollTop() {
    scrollToTop(this.element);
  },

  fetchComments(page) {
    const articleId = this.get('articleId');

    if (this.get('pagesCount') !== null && page !== null && page > this.get('pagesCount')) {
      page = this.get('pagesCount');
    }

    if (page !== null && page < 1) {
      page = 1;
    }

    if (page && articleId) {
      fetch(this.url(articleId, page))
        .then(response => response.json())
        .then((data) => {
          this.setProperties({
            comments: get(data, 'payload.comments'),
            users: get(data, 'payload.users'),
            pagesCount: get(data, 'pagesCount'),
          });
        });
      this.set('page', page);
    }
  },

  url(articleId, page = 0) {
    return this.wikiUrls.build({
      host: this.get('wikiVariables.host'),
      path: '/wikia.php',
      query: {
        controller: 'MercuryApi',
        method: 'getArticleComments',
        id: articleId,
        page,
        // TODO: clean me after premium bottom of page is released and icache expired
        premiumBottom: true,
      },
    });
  },
});
