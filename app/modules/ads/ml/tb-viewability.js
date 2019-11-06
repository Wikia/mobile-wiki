let config = {};

export const tbViewability = {
  configureTbViewability(billTheLizardConfig) {
    const {
      context,
      ViewabilityCounter,
    } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;
    const viewabilityCounter = ViewabilityCounter.make();
    config = billTheLizardConfig;

    if (!this.hasAvailableModels(config, 'tbviewability')) {
      return;
    }

    const enableTbViewability = context.get('options.billTheLizard.tbViewability');

    if (enableTbViewability === true) {
      billTheLizard.projectsHandler.enable('tbviewability');
    }

    context.set('services.billTheLizard.parameters', {
      tbviewability: {
        session_viewability_all: viewabilityCounter.getViewability(),
        session_viewability_icb: viewabilityCounter.getViewability('incontent_boxad'),
        session_viewability_tb: viewabilityCounter.getViewability('top_boxad'),
        ref: context.get('targeting.ref') || null,
        scrollY: this.calculateScrollY(),
        session_scroll_speed: this.calculateSessionScrollSpeed() || 0,
        s2: context.get('targeting.s2') || null,
      },
    });

    console.log(context.get('services.billTheLizard.parameters'));
  },

  calculateScrollY() {
    const scrollY = (window.scrollY || window.pageYOffset || 0) / 4500;

    return this.resultsProcessor(scrollY);
  },

  calculateSessionScrollSpeed() {
    const { ScrollSpeedCalculator } = window.Wikia.adServices;
    const scrollSpeedCalculator = ScrollSpeedCalculator.make();
    const scrollSpeed = (scrollSpeedCalculator.getAverageSessionScrollSpeed()) / 1000;

    return this.resultsProcessor(scrollSpeed);
  },

  hasAvailableModels(btlConfig, projectName) {
    const { utils } = window.Wikia.adEngine;
    const projects = btlConfig.projects || config.projects;

    return projects && projects[projectName]
      && projects[projectName].some(
        model => utils.geoService.isProperGeo(model.countries, model.name),
      );
  },

  resultsProcessor(param) {
    if (param >= 0 && param < 1) {
      return param;
    }
    if (param > 1) {
      return 1;
    }

    return 0;
  },
};

export default tbViewability;
