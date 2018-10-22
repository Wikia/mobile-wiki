import Service from '@ember/service';

export default Service.extend({
  isFullyLoaded: false,
  isSpinnerLoading: false,
  isEmptyLabel: false,
  isScrollTopDone: false,
  isAnimOutDone: false,
  isAnimInDone: false,

  onScrollTop() {},
  onAnimDone() {},

  resetValues() {
    this.set('isFullyLoaded', false);
    this.set('isSpinnerLoading', false);
    this.set('isEmptyLabel', false);
    this.set('isScrollTopDone', false);
    this.set('isAnimOutDone', false);
    this.set('isAnimInDone', false);
  },

  afterArticleLoaded() {
    this.set('isFullyLoaded', true);
    this.set('isSpinnerLoading', false);
    this.set('isEmptyLabel', true);
  },
});
