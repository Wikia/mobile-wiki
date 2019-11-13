import hasAvailableModels from './utils';

/**
 * Converts parameter to value between 0-1 to be passed to the model
 *
 * @param {number} param
 * @returns {number}
 */
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
  /**
   * @param {Object} config
   */
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

    // Even though the model is for top_boxad viewability we are passing 'top_page' param.
    // It was changed because passing 'top_boxad' makes bill-the-lizard responses tracked to DW
    // a bit weird since there is another model already sending request for that slot (cheshire cat)
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
