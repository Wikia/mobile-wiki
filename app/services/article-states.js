import Service from '@ember/service';

export default Service.extend({
  isFullyLoaded: false,
  isSpinnerLoading: true,

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
});
