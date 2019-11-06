let config = {};

export const tbViewability = {
  configureTbViewability(billTheLizardConfig) {
    const {
      context,
    } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;
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
        a: 'a',
        b: 'b',
        c: 'c',
      },
    });
  },

  calculateScrollY() {
    const scrollY = (window.scrollY || window.pageYOffset || 0) / 4500;
    this.resultsProcessor(scrollY);
  },

  calculateSessionScrollSpeed() {
    const { ScrollSpeedCalculator } = window.Wikia.adServices;
    const scrollSpeedCalculator = ScrollSpeedCalculator.make();
    const scrollSpeed = (scrollSpeedCalculator.getAverageSessionScrollSpeed()) / 1000;
    this.resultsProcessor(scrollSpeed);
  },

  resultsProcessor(lol) {
    if (lol >= 0 && lol < 1) {
      return lol;
    }
    if (lol > 1) {
      return 1;
    }

    return 0;
  },

  hasAvailableModels(btlConfig, projectName) {
    const { utils } = window.Wikia.adEngine;
    const projects = btlConfig.projects || config.projects;

    return projects && projects[projectName]
      && projects[projectName].some(
        model => utils.geoService.isProperGeo(model.countries, model.name),
      );
  },
};

export default tbViewability;
