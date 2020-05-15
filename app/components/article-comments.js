import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { not } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import scrollToTop from '../utils/scroll-to-top';
import { track, trackActions } from '../utils/track';

/**
  * Component that displays article comments
*/
export default Component.extend({
  preserveScroll: service(),
  articleComments: service(),

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
      this.articleComments.load({ title: this.articleTitle, id: this.articleId});

      scheduleOnce('afterRender', this, () => {
        this.scrollTop();
      });
    }
  },

  actions: {
    /**
      * @returns {void}
    */
    toggleComments() {
      this.set('preserveScroll.preserveScrollPosition', true);
      this.toggleProperty('isCollapsed');

      if (this.isCollapsed) {
        this.set('page', null);
      } else {
        this.articleComments.load({ title: this.articleTitle, id: this.articleId});
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
});
