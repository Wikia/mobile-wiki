import { pageTracker } from '../tracking/page-tracker';
import { cheshireCat } from './cheshire-cat';

// const logGroup = 'bill-the-lizard-wrapper';

export const billTheLizardWrapper = {
  configureBillTheLizard(billTheLizardConfig) {
    const {
      eventService
    } = window.Wikia.adEngine;
    const { billTheLizardEvents } = window.Wikia.adServices;

    cheshireCat.configureCheshireCat(billTheLizardConfig);

    // context.set('services.billTheLizard.projects', config.projects);
    // context.set('services.billTheLizard.timeout', config.timeout || 0);

    eventService.on(billTheLizardEvents.BILL_THE_LIZARD_REQUEST, (event) => {
      const { query, callId } = event;
      console.log('tbl-req', event);
      let propName = 'btl_request';
      if (callId) {
        propName = `${propName}_${callId}`;
      }

      pageTracker.trackProp(propName, query);
    });

    eventService.on(billTheLizardEvents.BILL_THE_LIZARD_RESPONSE, (event) => {
      const { response, callId } = event;
      console.log('tbl-res', event);
      let propName = 'btl_response';git
      if (callId) {
        propName = `${propName}_${callId}`;
      }
      pageTracker.trackProp(propName, response);
    });
  },

  // hasAvailableModels(btlConfig, projectName) {
  //   const { utils } = window.Wikia.adEngine;
  //   const projects = btlConfig.projects || config.projects;
  //
  //   return projects && projects[projectName]
  //     && projects[projectName].some(
  //       model => utils.geoService.isProperGeo(model.countries, model.name),
  //     );
  // },
};

export default billTheLizardWrapper;
