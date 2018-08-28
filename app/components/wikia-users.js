import { notEmpty, map } from '@ember/object/computed';
import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import { track, trackActions } from '../utils/track';

export default Component.extend(InViewportMixin, {
  classNames: ['contributors'],
  users: null,

  isVisible: notEmpty('users'),
  avatars: map('users', user => (
    {
      src: user.avatar,
      alt: user.name,
      link: user.url,
    }
  )),

  init() {
    this._super(...arguments);

    this.trackClick = this.trackClick.bind(this);
  },

  didInsertElement() {
    this._super(...arguments);

    this.element.addEventListener('click', this.trackClick);
  },

  /**
	 * Reset InViewPort when new users recieved
	 */
  didUpdateAttrs() {
    if (this.viewportEntered) {
      this.set('viewportEntered', false);
      this._startListening();
    }
  },

  trackClick() {
    track({
      action: trackActions.click,
      category: 'contributors',
      label: 'open-user',
    });
  },
});
