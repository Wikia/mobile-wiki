import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@ember/component';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import { track, trackActions } from '../utils/track';
import scrollToTop from '../utils/scroll-to-top';

export default Component.extend(
  AlertNotificationsMixin,
  {
    i18n: service(),
    logger: service(),
    classNames: ['category-page'],
    isLoading: false,

    didRender() {
      this._super(...arguments);
      window.lazySizes.init();
    },

    /**
     * @param {number} from
     * @param {string} label
     * @param {Event} event
     */
    @action
    doLoadFrom(from, label, event) {
      event.preventDefault();

      scrollToTop(this.element, 'instant');
      this.set('isLoading', true);

      track({
        action: trackActions.click,
        category: 'category-page',
        label: `load-${label}`,
      });

      this.loadFrom(from)
        .catch((error) => {
          this.addAlert({
            message: this.i18n.t('category-page.load-error'),
            type: 'alert',
          });

          this.logger.error(error);
        })
        .finally(() => {
          this.set('isLoading', false);
        });
    },
  },
);
