import Service from '@ember/service';

export default Service.extend({
  isFullyLoaded: false,
  isSpinnerLoading: true,
  isEmptyLabel: false,

  articleDidLoad() {
    this.set('isFullyLoaded', true);
  },
  articleLoading() {
    this.set('isFullyLoaded', false);
  },
  spinnerOff() {
    this.set('isSpinnerLoading', false);
  },
  spinnerOn() {
    this.set('isSpinnerLoading', true);
  },
  showEmptyLabel() {
    this.set('isEmptyLabel', true);
  },
  hideEmptyLabel() {
    this.set('isEmptyLabel', false);
  },
});
