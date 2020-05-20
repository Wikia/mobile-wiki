import Component from '@ember/component';
import { computed, get, observer } from '@ember/object';
import { not } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import InViewportMixin from 'ember-in-viewport';
import scrollToTop from '../utils/scroll-to-top';
import { track, trackActions } from '../utils/track';
import { ArticleCommentCountError } from '../utils/errors';

/**
 * Component that displays article comments
 */
export default Component.extend(InViewportMixin, {
  preserveScroll: service(),
  wikiVariables: service(),
  wikiUrls: service(),
  fetch: service(),
  articleComments: service(),

  classNames: ['article-comments', 'mw-content'],

  page: null,
  articleId: null,
  commentsCount: null,
  model: null,
  isUcp: false,
  isCollapsed: true,

  comments: null,
  users: null,
  pagesCount: null,

  showComments: not('isCollapsed'),
  prevButtonDisabled: computed('page', function () {
    return parseInt(this.page, 10) === 1;
  }),
  nextButtonDisabled: computed('page', 'pagesCount', function () {
    return parseInt(this.page, 10) >= this.pagesCount;
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
    const page = this.page;

    this._super(...arguments);

    if (page !== null) {
      this.set('isCollapsed', false);
      this.fetchCommentsBasedOnPlatform();

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
      const page = parseInt(this.page, 10);

      this.set('preserveScroll.preserveScrollPosition', true);
      this.fetchComments(page + 1);
      this.scrollTop();
    },

    /**
     * @returns {void}
     */
    prevPage() {
      const page = parseInt(this.page, 10);

      this.set('preserveScroll.preserveScrollPosition', true);
      this.fetchComments(page - 1);
      this.scrollTop();
    },

    /**
     * @returns {void}
     */
    toggleComments() {
      this.set('preserveScroll.preserveScrollPosition', true);
      this.toggleProperty('isCollapsed');

      if (this.isCollapsed) {
        this.set('page', null);
      } else {
        this.fetchCommentsBasedOnPlatform();
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
    const articleId = this.articleId;

    if (this.pagesCount !== null && page !== null && page > this.pagesCount) {
      page = this.pagesCount;
    }

    if (page !== null && page < 1) {
      page = 1;
    }

    if (page && articleId) {
      this.fetch.fetchFromMediawiki(this.url(articleId, page), ArticleCommentCountError)
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
      forceNoSSLOnServerSide: true,
      path: '/wikia.php',
      query: {
        controller: 'MercuryApi',
        method: 'getArticleComments',
        id: articleId,
        page,
      },
    });
  },

  fetchCommentsBasedOnPlatform() {
    if (this.isUcp) {
      this.articleComments.load({ title: this.articleTitle, id: this.articleId });
    } else {
      this.fetchComments(parseInt(this.page, 10));
    }
  },

  didEnterViewport() {
    if (this.isUcp) {
      // to make sure we won't show cached value we have to fetch these comments on FE
      this.articleComments
        .fetchCount(this.articleId)
        .then((count) => {
          if (count) {
            this.set('commentsCount', count);
          }
        });
    }
  },
});
