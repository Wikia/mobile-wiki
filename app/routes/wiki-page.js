import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { resolve } from 'rsvp';
import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import ArticleHandler from '../utils/wiki-handlers/article';
import BlogHandler from '../utils/wiki-handlers/blog';
import CategoryHandler from '../utils/wiki-handlers/category';
import CuratedMainPageHandler from '../utils/wiki-handlers/curated-main-page';
import FileHandler from '../utils/wiki-handlers/file';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';
import RouteWithAdsMixin from '../mixins/route-with-ads';
import WikiPageHandlerMixin from '../mixins/wiki-page-handler';
import closedWikiHandler from '../utils/closed-wiki-handler';
import emptyDomainWithLanguageWikisHandler from '../utils/empty-domain-with-language-wikis-handler';
import { WikiIsClosedError } from '../utils/errors';
import extend from '../utils/extend';
import { normalizeToUnderscore } from '../utils/string';
import { setTrackContext, trackPageView, track } from '../utils/track';
import {
  namespace as mediawikiNamespace,
  isContentNamespace,
} from '../utils/mediawiki-namespace';
import Ads from '../modules/ads';
import { logError } from '../modules/event-logger';
import feedsAndPosts from '../modules/feeds-and-posts';
import gatherMetrics from '../utils/performance';

export default Route.extend(
  HeadTagsDynamicMixin,
  RouteWithAdsMixin,
  WikiPageHandlerMixin,
  {
    ads: service('ads/ads'),
    currentUser: service(),
    fastboot: service(),
    i18n: service(),
    initialPageView: service(),
    logger: service(),
    wikiVariables: service(),
    lightbox: service(),
    wikiUrls: service(),
    runtimeConfig: service(),

    queryParams: {
      from: {
        // See controllers/category#actions.loadFrom
        refreshModel: false,
        // Would be better to support back and forward buttons
        // but I wasn't able to reload the model on history change
        replace: true,
      },
      debugAffiliateUnits: {
        refreshModel: true,
      },
    },

    redirectEmptyTarget: false,
    wikiHandler: null,

    /**
     * @param {EmberStates.Transition} transition
     * @returns {void}
     */
    beforeModel(transition) {
      this._super(transition);

      closedWikiHandler(this.wikiVariables);
      emptyDomainWithLanguageWikisHandler(this.fastboot, this.wikiVariables);

      if (!transition.data.title) {
        transition.data.title = decodeURIComponent(transition.params['wiki-page'].title);
      }

      const title = transition.data.title;

      // If you try to access article with not-yet-sanitized title you can see in logs:
      // `Transition #1: detected abort.`
      // This is caused by the transition below but doesn't mean any additional requests.
      // TODO: This could be improved upon by not using an Ember transition to 'rewrite' the URL
      // Ticket here: https://wikia-inc.atlassian.net/browse/HG-641
      if (title.indexOf(' ') > -1) {
        // title needs to be encoded here
        // because it may be redirected to https later and url with this title
        // is put into location header. If it's not encoded and contains utf characters, then
        // "TypeError: The header content contains invalid characters" is thrown
        this.transitionTo('wiki-page', encodeURIComponent(normalizeToUnderscore(title)));

        if (this.fastboot.isFastBoot) {
          this.fastboot.set('response.statusCode', 301);
        }
      }

      // if title is empty, we want to redirect to main page
      if (!title.length) {
        this.transitionTo('wiki-page', this.get('wikiVariables.mainPageTitle'));
      }
    },

    /**
     * @param {*} params
     * @returns {RSVP.Promise}
     */
    model(params, transition) {
      const wikiVariables = this.wikiVariables;
      const host = wikiVariables.get('host');
      const modelParams = {
        host,
        title: transition.data.title,
        wiki: wikiVariables.get('dbName'),
      };

      if (params.from) {
        modelParams.from = params.from;
      }

      if (params.debugAffiliateUnits) {
        modelParams.debugAffiliateUnits = params.debugAffiliateUnits;
      }

      return resolve(this.getPageModel(modelParams));
    },

    /**
     * @param {Ember.Object} model
     * @param {EmberStates.Transition} transition
     * @returns {void}
     */
    afterModel(model, transition) {
      this._super(...arguments);
      if (model) {
        const fastboot = this.fastboot;
        const wikiUrls = this.wikiUrls;
        const handler = this.getHandler(model);
        const surrogateKeys = model.get('surrogateKeys');
        let redirectTo = model.get('redirectTo');

        if (model.isRandomPage) {
          this.transitionTo('wiki-page', encodeURIComponent(normalizeToUnderscore(model.title)));
        }

        if (fastboot.get('isFastBoot')) {
          if (surrogateKeys) {
            surrogateKeys.forEach((key) => {
              fastboot.get('response.headers').append('Surrogate-Key', key);
            });
          }
        }

        if (model.redirected) {
          if (fastboot.get('isFastBoot')) {
            fastboot.get('response.headers').set('location', model.redirectTargetUrl);
            fastboot.set('response.statusCode', 301);
          } else {
            const encodedTitle = encodeURIComponent(normalizeToUnderscore(model.title));

            this.transitionTo('wiki-page', encodedTitle);
          }

          return;
        }

        if (handler) {
          scheduleOnce('afterRender', () => {
            // Tracking has to happen after transition is done.
            // Otherwise we track to fast and url isn't
            // updated yet. `didTransition` hook is called too fast.
            this.trackPageView(model);
            if (!fastboot.get('isFastBoot')) {
              gatherMetrics(
                this.get('wikiVariables.wgPerformanceMonitoringEndpointUrl'),
                this.get('wikiVariables.wgPerformanceMonitoringSoftwareVersion'),
                this.get('wikiVariables.wgPerformanceMonitoringSamplingFactor'),
              );
            }

            if (!fastboot.get('isFastBoot') && model.adsContext) {
              model.adsContext.user = model.adsContext.user || {};
              model.adsContext.user.isAuthenticated = this.get('currentUser.isAuthenticated');
              Ads.ensureMode(model.adsContext);
              Ads.getInstance().init(model.adsContext, transition.queryParams);
            }

            // If it's an article page and the extension is enabled, load the Feeds & Posts module
            if (!fastboot.get('isFastBoot')
              && isContentNamespace(model.ns, this.get('wikiVariables.contentNamespaces'))
              && this.get('wikiVariables.enableEmbeddedFeedsModule')
            ) {
              const fpOptions = {
                communityName: this.get('wikiVariables.siteName'),
                track,
                communityId: this.get('wikiVariables.id'),
                language: this.get('wikiVariables.language.content'),
              };
              feedsAndPosts.getModule().then((fandomEmbeddedFeeds) => {
                feedsAndPosts.loadFeed(fandomEmbeddedFeeds, fpOptions, model.isMainPage);
              });
            }
          });

          transition.then(() => {
            if (typeof handler.afterTransition === 'function') {
              handler.afterTransition({
                model,
                wikiId: this.get('wikiVariables.id'),
                host: this.get('wikiVariables.host'),
                fastboot,
                wikiUrls,
              });
            }
          });

          this.set('wikiHandler', handler);

          handler.afterModel(this, ...arguments);
        } else {
          if (!redirectTo) {
            redirectTo = wikiUrls.build({
              host: this.get('wikiVariables.host'),
              wikiPage: get(transition, 'params.wiki-page.title'),
              query: extend(
                {},
                transition.state.queryParams,
                { useskin: 'oasis' },
              ),
            });
          }

          if (fastboot.get('isFastBoot')) {
            fastboot.get('response.headers').set('location', redirectTo);
            fastboot.set('response.statusCode', 301);
          } else {
            window.location.replace(redirectTo);
          }
        }
      } else {
        this.logger.warn('Unsupported page');
      }
    },

    /**
     * @param {Ember.Controller} controller
     * @param {Ember.Model} model
     * @returns {void}
     */
    renderTemplate(controller, model) {
      const handler = this.wikiHandler;

      if (handler) {
        this.render(handler.viewName, {
          controller: handler.controllerName,
          model,
        });
      }
    },

    /**
     *
     * @param {Ember.Controller} controller
     * @returns {void}
     */
    resetController(controller) {
      controller.set('preserveScrollPosition', false);
    },

    actions: {
      /**
       * @returns {void}
       */
      willTransition() {
        // notify a property change on soon to be stale model for observers (like
        // the Table of Contents menu) can reset appropriately
        this.notifyPropertyChange('displayTitle');

        try {
          this.ads.beforeTransition();
        } catch (e) {
          logError(this.runtimeConfig.servicesExternalHost, 'beforeTransition', e);
        }

        this.lightbox.close();
      },

      /**
       * @returns {boolean}
       */
      didTransition() {
        if (this.redirectEmptyTarget) {
          this.controllerFor('application').addAlert({
            message: this.i18n.t('article.redirect-empty-target'),
            type: 'warning',
          });
        }

        return true;
      },

      /**
       * We can't use the built-in mechanism to render error substates
       * It bubbles the error to application route and then FastBoot dies
       * Instead, we transition to substate manually and prevent the bubbling
       *
       * @param {EmberError} error
       * @returns {boolean}
       */
      error(error) {
        // Error handler in application route will take care of it
        if (error instanceof WikiIsClosedError) {
          return true;
        }

        if (this.get('fastboot.isFastBoot') && (
          !error.code || error.code !== 404
        )) {
          this.logger.error('Wiki page error', error);
        }

        this.intermediateTransitionTo('wiki-page_error', error);

        return false;
      },

      /**
       * When we load another page for category members, we don't reload the route's model
       * Because of that, we need to trigger the head tags update manually
       */
      updateDynamicHeadTags() {
        this.setDynamicHeadTags(this.get('controller.model'));
      },
    },

    /**
     * @param {Ember.Object} model
     * @returns {Object} handler for current namespace
     */
    getHandler(model) {
      const currentNamespace = model.ns;

      if (model.isCuratedMainPage) {
        return CuratedMainPageHandler;
      }
      if (isContentNamespace(currentNamespace, this.get('wikiVariables.contentNamespaces'))) {
        return ArticleHandler;
      }
      if (currentNamespace === mediawikiNamespace.CATEGORY) {
        return CategoryHandler;
      }
      if (currentNamespace === mediawikiNamespace.FILE) {
        return FileHandler;
      }
      if (currentNamespace === mediawikiNamespace.BLOG_ARTICLE) {
        return BlogHandler;
      }
      this.logger.debug(`Unsupported NS passed to getHandler - ${currentNamespace}`);
      return null;
    },

    /**
     * Custom implementation of HeadTagsMixin::setDynamicHeadTags
     * @param {Object} model, this is model object from route::afterModel() hook
     * @returns {void}
     */
    setDynamicHeadTags(model) {
      const handler = this.wikiHandler;
      const pageUrl = model.get('url');
      const pageFullUrl = `${this.get('wikiVariables.basePath')}${pageUrl}`;
      const data = {
        htmlTitle: model.get('htmlTitle'),
        description: model.get('description'),
        robots: 'index,follow',
        canonical: pageFullUrl,
        amphtml: model.get('amphtml'),
      };

      if (pageUrl) {
        data.appArgument = pageFullUrl;
      }

      if (handler && typeof handler.getDynamicHeadTags === 'function') {
        extend(data, handler.getDynamicHeadTags(model));
      }

      this._super(model, data);
    },

    /**
     * @param {ArticleModel} model
     * @returns {void}
     */
    trackPageView(model) {
      const articleType = model.get('articleType');
      const namespace = model.get('ns');
      const uaDimensions = {};

      // update UA dimensions
      if (model.adsContext) {
        uaDimensions[3] = model.adsContext.targeting.wikiVertical;
        uaDimensions[14] = model.adsContext.opts.showAds ? 'yes' : 'no';
      }
      if (articleType) {
        uaDimensions[19] = articleType;
      }
      if (typeof namespace !== 'undefined') {
        uaDimensions[25] = namespace;
      }

      uaDimensions[21] = model.get('id');
      uaDimensions[28] = model.get('hasPortableInfobox') ? 'yes' : 'no';
      uaDimensions[29] = model.get('featuredVideo') ? 'yes' : 'no';

      const wikiPageDataShoebox = document.getElementById('shoebox-wikiPage');
      let rolloutTracking = '';
      if (wikiPageDataShoebox) {
        const wikiPageData = JSON.parse(wikiPageDataShoebox.innerHTML);
        if (wikiPageData && wikiPageData.data && wikiPageData.data.isUcp) {
          rolloutTracking = 'ucp';
        }
      }
      
      const url = window.location.href;
      setTrackContext({
        a: model.get('id'),
        n: namespace,
        rollout_tracking: rolloutTracking,
        url: url,
        test_jbera: 'test_jbera',
      });

      trackPageView(this.initialPageView.isInitialPageView(), uaDimensions);
    },
  },
);
