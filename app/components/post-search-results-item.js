import Component from '@ember/component';
import { computed } from '@ember/object';

import { track, trackActions } from '../utils/track';
import Thumbnailer from '../modules/thumbnailer';

export default Component.extend({
  classNames: ['post-search-results-item'],

  // some old posts do not have title, we'll fake it here
  getTitle: computed('post', function () {
    if (this.post.title) {
      return this.post.title;
    }

    if (this.post.content.length > 100) {
      return this.post.content.substring(0, 100) + '&hellip;';
    }

    return this.post.content;
  }),

  isQuizWithTakes: computed('post', function () {
    const type = this.post.type;

    if (type !== 'quiz') {
      return false;
    }

    return this.post.quizTakes && parseInt(this.post.quizTakes, 10) > 0;
  }),

  isPollWithVotes: computed('post', function () {
    const type = this.post.type;

    if (type !== 'poll') {
      return false;
    }

    return this.post.pollVotes && parseInt(this.post.pollVotes, 10) > 0;
  }),

  isPost: computed('isPollWithVotes,isQuizWithTakes', function () {
    return !(this.isPollWithVotes || this.isQuizWithTakes);
  }),

  imageThumbnail: computed('post.image', function () {
    const image = this.post.image;

    const options = {
      height: 48,
      mode: Thumbnailer.mode.smart,
      width: 48,
    };

    return image ? Thumbnailer.getThumbURL(image, options) : undefined;
  }),

  actions: {
    trackClick(number) {
      track({
        action: trackActions.click,
        category: 'search_posts',
        label: `item-${parseInt(number, 10) + 1}`,
      });
    },
  },
});
