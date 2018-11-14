import { computed } from '@ember/object';
import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = EmberRouter.extend(RouterScroll, {
  wikiUrls: service(),

  location: config.locationType,
  rootURL: computed(function () {
    const langPath = this.get('wikiUrls.langPath');
    if (langPath) {
      return `${langPath}/`;
    }
    return '/';
  }),
});

/* eslint array-callback-return: 0 */
Router.map(function () {
  this.route('article-preview');
  this.route('closed-wiki', {
    path: '/__closed_wiki__this_is_never_visible_to_user',
  });
  this.route('search');

  this.route('language-wikis-index', {
    path: '/language-wikis',
  });

  this.route('main-page-redirect', {
    path: '/wiki/',
  });

  this.route('wiki-page', {
    path: '/wiki/*title',
  });
});

export default Router;
