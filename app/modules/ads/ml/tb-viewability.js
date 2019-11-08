import hasAvailableModels from './utils';

function resultsProcessor(param) {
  if (param >= 0 && param < 1) {
    return param;
  }
  if (param > 1) {
    return 1;
  }

  return 0;
}

export const tbViewability = {
  configure(config) {
    const {
      billTheLizard,
      context,
      ViewabilityCounter,
    } = window.Wikia.adEngine;
    const viewabilityCounter = ViewabilityCounter.make();

    if (!hasAvailableModels(config, 'tb_viewability')) {
      return;
    }

    billTheLizard.projectsHandler.enable('tb_viewability');

    // viewabilityCounter already sets default to 0.5 and is between 0-1
    context.set('services.billTheLizard.parameters', {
      tb_viewability: {
        session_viewability_all: viewabilityCounter.getViewability(),
        session_viewability_icb: viewabilityCounter.getViewability('incontent_boxad'),
        session_viewability_tb: viewabilityCounter.getViewability('top_boxad'),
        ref: context.get('targeting.ref') || null,
        scroll_y: this.calculateScrollY(),
        session_scroll_speed: this.calculateSessionScrollSpeed() || 0,
        s0v: context.get('targeting.s0v') || null,
        s2: context.get('targeting.s2') || null,
      },
    });

    // consulted 'top_page' parameter with Martyna, if we sent top_boxad cheshire is going mad
    billTheLizard.call(['tb_viewability'], 'top_page');
  },

  calculateScrollY() {
    const scrollY = (window.scrollY || window.pageYOffset || 0) / 4500;

    return resultsProcessor(scrollY);
  },

  calculateSessionScrollSpeed() {
    const { ScrollSpeedCalculator } = window.Wikia.adServices;
    const scrollSpeedCalculator = ScrollSpeedCalculator.make();
    const scrollSpeed = (scrollSpeedCalculator.getAverageSessionScrollSpeed()) / 1000;

    return resultsProcessor(scrollSpeed);
  },
};

export default tbViewability;
