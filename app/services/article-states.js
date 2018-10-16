import Service from '@ember/service';

export default Service.extend({
  isFullyLoaded: false,
  isSpinnerLoading: false,
  isEmptyLabel: false,
  isScrollTopDone: false,
  isAnimOutDone: false,

  resetValues() {
    this.set('isFullyLoaded', false);
    this.set('isSpinnerLoading', true);
    this.set('isEmptyLabel', false);
  },

  afterArticleLoaded() {
    this.set('isFullyLoaded', true);
    this.set('isSpinnerLoading', false);
    this.set('isEmptyLabel', true);
  },
});
