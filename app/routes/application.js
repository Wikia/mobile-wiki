import { getOwner } from '@ember/application';
import { getWithDefault } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import applicationRedirect from '@wikia/ember-fandom/utils/application-redirect';
import { DontLogMeError } from '@wikia/ember-fandom/utils/errors';
import Ember from 'ember';
import config from '../config/environment';
import HeadTagsStaticMixin from '../mixins/head-tags-static';
import ApplicationModel from '../models/application';
import Ads from '../modules/ads';
import ErrorDescriptor from '../utils/error-descriptor';
import {
  WikiIsClosedError,
  WikiVariablesRedirectError,
} from '../utils/errors';
import {
  CachingInterval, CachingPolicy, disableCache, setResponseCaching,
} from '../utils/fastboot-caching';
import { track, trackActions } from '../utils/track';

export default Route.extend(
  Ember.TargetActionSupport,
  HeadTagsStaticMixin,
  {
    ads: service('ads/ads'),
    currentUser: service(),
    migrationNotification: service(),
    fastboot: service(),
    i18n: service(),
    lightbox: service(),
    logger: service(),
    wikiUrls: service(),
    wikiVariables: service(),
    smartBanner: service(),
    router: service(),
    fastlyInsights: service(),

    queryParams: {
      file: {
        replace: true,
      },
      commentsPage: {
        replace: true,
        refreshModel: false,
      },
      noexternals: {
        replace: true,
      },
      uselang: {
        replace: true,
      },
    },
    noexternals: null,

    init() {
      this._super(...arguments);
      if (!this.fastboot.get('isFastBoot')) {
        window.pageviewTime.setupPageTime();
      }
    },

    beforeModel(transition) {
      this._super(transition);

      if (transition.targetName === 'wiki-page') {
        transition.data.title = decodeURIComponent(transition.params[transition.targetName].title);
      }

      if (!this.fastboot.get('isFastBoot')) {
        window.pageviewTime.finishPageview();
      }
    },

    model(params, transition) {
      const fastboot = this.fastboot;
      const wikiPageTitle = transition.data.title;

      return ApplicationModel.create(getOwner(this).ownerInjection())
        .fetch(wikiPageTitle, transition.queryParams.uselang)
        .then((applicationData) => {
          this.wikiVariables.setProperties(applicationData.wikiVariables);

          if (fastboot.get('isFastBoot')) {
            this.injectScriptsFastbootOnly(applicationData.wikiVariables, transition.queryParams);
          }

          return applicationData;
        })
        .catch((error) => {
          if (error instanceof WikiVariablesRedirectError) {
            fastboot.get('response.headers').set(
              'location',
              error.additionalData[0].redirectLocation,
            );
            fastboot.set('response.statusCode', 302);
          } else {
            this.logger.warn(`wikiVariables error: ${error}`);
          }

          throw error;
        });
    },

    afterModel(model, transition) {
      const fastboot = this.fastboot;

      this._super(...arguments);

      this.i18n.initialize(transition.queryParams.uselang || model.wikiVariables.language.content);

      if (
        !fastboot.get('isFastBoot')
        && !transition.queryParams.noexternals
      ) {
        Ads.getLoadedInstance()
          .then((ads) => {
            ads.registerActions({
              onHeadOffsetChange: (offset) => {
                this.set('ads.siteHeadOffset', offset);
              },
              onSmartBannerChange: (visibility) => {
                this.set('smartBanner.smartBannerVisible', visibility);
              },
            });
          })
          .catch(() => {}); // Ads not loaded

        this.fastlyInsights.loadFastlyInsightsScript();
      }

      if (fastboot.get('isFastBoot')) {
        // https://www.maxcdn.com/blog/accept-encoding-its-vary-important/
        // https://www.fastly.com/blog/best-practices-for-using-the-vary-header
        fastboot.get('response.headers').set('vary', 'cookie,accept-encoding');
        fastboot.get('response.headers').set('Content-Language', model.wikiVariables.language.content);

        // Send per-wiki surrogate key header
        let surrogateKey = model.wikiVariables.surrogateKey;
        if (surrogateKey) {
          // append mobile-wiki specific key
          surrogateKey = `${surrogateKey} ${surrogateKey}-mobile-wiki`;
          fastboot.get('response.headers').set('Surrogate-Key', surrogateKey);
        }

        // TODO remove `transition.queryParams.page`when icache supports surrogate keys
        // and we can purge the category pages
        if (this.get('currentUser.isAuthenticated') || transition.queryParams.page) {
          disableCache(fastboot);
        } else {
          // TODO don't cache errors
          setResponseCaching(fastboot, {
            enabled: true,
            cachingPolicy: CachingPolicy.Public,
            varnishTTL: CachingInterval.standard,
            browserTTL: CachingInterval.disabled,
          });
        }
      }

      this.migrationNotification.showNotification();
    },

    redirect(model) {
      applicationRedirect(model, this.fastboot);
    },

    activate() {
      // Qualaroo custom parameters
      if (!this.get('fastboot.isFastBoot') && window._kiq) {
        window._kiq.push(['set', {
          isLoggedIn: this.get('currentUser.isAuthenticated'),
          contentLanguage: this.get('wikiVariables.language.content'),
        }]);
      }
    },

    actions: {
      loading(transition) {
        if (!this.fastboot.get('isFastBoot')) {
          window.pageviewTime.finishPageview();
        }
        if (this.controller) {
          this.controller.set('isLoading', true);
          transition.promise.finally(() => {
            this.controller.set('isLoading', false);
          });
        }
      },

      didTransition() {
        this.get('ads.module').onTransition();

        // Clear notification alerts for the new route
        this.controller.clearNotifications();

        // sets number of page views for Qualaroo
        if (window._kiq) {
          window._kiq.push(['set', { page_views: this.get('router._routerMicrolib.currentSequence') }]);
        }

        if (!this.fastboot.get('isFastBoot')) {
          window.pageviewTime.initPageview();
        }
      },

      error(error, transition) {
        const fastboot = this.fastboot;

        // TODO XW-3198
        // Don't handle special type of errors.
        // Currently we use them hack Ember and stop executing application
        if (error instanceof DontLogMeError) {
          return false;
        }

        if (error instanceof WikiIsClosedError) {
          this.intermediateTransitionTo('closed-wiki');
          return false;
        }

        this.logger.error('Application error', error);
        if (fastboot.get('isFastBoot')) {
          fastboot.get('shoebox').put('serverError', true);
          fastboot.set('response.statusCode', getWithDefault(error, 'code', 503));
          this.injectScriptsFastbootOnly(null, transition.queryParams);

          // We can't use the built-in mechanism to render error substates.
          // When FastBoot sees that application route sends error, it dies.
          // Instead, we transition to the error substate manually.
          const errorDescriptor = ErrorDescriptor.create({ error });
          this.intermediateTransitionTo('application_error', errorDescriptor);
          return false;
        }

        return true;
      },

      /**
    * @param {HTMLAnchorElement} target
    * @returns {void}
    */
      handleLink(target) {
        const currentRoute = this.router.get('currentRouteName');

        let title;

        if (currentRoute === 'wiki-page') {
          title = this.controllerFor('wikiPage').get('model').get('title');
        } else {
          title = '';
        }

        const trackingCategory = target.dataset.trackingCategory;
        const info = this.wikiUrls.getLinkInfo(
          title,
          target.hash,
          target.href,
          target.search,
        );

        /*
        * Handle tracking
        */
        if (trackingCategory) {
          track({
            action: trackActions.click,
            category: trackingCategory,
          });
        }

        /*
        * handle links that are external to the application
        */
        if (target.className.indexOf('external') > -1) {
          window.location.assign(target.href);
        } else if (info.article) {
          this.transitionTo('wiki-page', info.article + (info.hash ? info.hash : ''));
        } else if (info.url) {
          /**
          * If it's a jump link or a link to something in a Wikia domain,
          * treat it like a normal link
          * so that it will replace whatever is currently in the window.
          */
          const domainRegex = new RegExp(
            `^https?:\\/\\/[^\\/]+\\.${config.APP.baseDomainRegex}\\/.*$`,
          );

          if (info.url.charAt(0) === '#' || info.url.match(domainRegex)) {
            window.location.assign(info.url);
          } else {
            window.open(info.url);
          }
        } else {
          // Reaching this clause means something is probably wrong.
          this.logger.error('Unable to open link', target.href);
        }
      },
    },

    injectScriptsFastbootOnly() {
      this._super(...arguments);

      if (!this.get('fastboot.isFastBoot')) {
        return;
      }

      // Render components into FastBoot's HTML,
      // outside of the Ember app so they're not touched when Ember starts
      const applicationInstance = getOwner(this);
      const document = applicationInstance.lookup('service:-document');
      const bodyBottomComponent = applicationInstance.lookup('component:fastboot-only/body-bottom');

      bodyBottomComponent.appendTo(document.body);
    },
  },
);
