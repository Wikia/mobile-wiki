import { inject as service } from '@ember/service';
import { or } from '@ember/object/computed';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import Ember from 'ember';
import truncate from '../utils/truncate';
import nl2br from '../utils/nl2br';

export default Component.extend({
  wikiVariables: service(),

  classNames: ['post-detail'],

  openGraphSiteName: or('post.openGraph.domain', 'post.openGraph.siteName'),
  openGraphImageUrl: computed('post.openGraph.imageUrl', function () {
    const imageWidth = 525;
    const imageHeight = parseInt(imageWidth * 9 / 16, 10);

    if (!this.get('post.openGraph.imageUrl')) {
      return '';
    }

    return `${this.get('post.openGraph.imageUrl')}/zoom-crop/width/${imageWidth}/height/${imageHeight}`;
  }),

  parsedContent: computed('post.rawContent', function () {
    let escapedContent = Ember.Handlebars.Utils.escapeExpression(
      this.get('post.rawContent'),
    ).trim();

    escapedContent = truncate(escapedContent, 148);
    escapedContent = nl2br(escapedContent);

    return htmlSafe(escapedContent);
  }),

  baseFeedsUrl: computed(function () {
    return `${this.wikiVariables.scriptPath}/f`;
  }),
});
