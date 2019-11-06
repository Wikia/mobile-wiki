let config = {};

export const tbViewability = {
  configureTbViewability(billTheLizardConfig) {
    const {
      context,
    } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;
    config = billTheLizardConfig;

    if (!this.hasAvailableModels(config, 'tbviewability')) {
      console.log('tbview not available')
      return;
    }
    const enableTbViewability = context.get('options.billTheLizard.tbViewability');

    if (enableTbViewability === true) {
      billTheLizard.projectsHandler.enable('tbviewability');
    }
    console.log('tbview configured');
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
