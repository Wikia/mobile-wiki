import { pageTracker } from '../tracking/page-tracker';
import { cheshireCat } from './cheshire-cat';
import { tbViewability } from './tb-viewability';

export const billTheLizardWrapper = {
  configureBillTheLizard(billTheLizardConfig) {
    const {
      context, eventService,
    } = window.Wikia.adEngine;
    const { billTheLizardEvents } = window.Wikia.adServices;

    context.set('services.billTheLizard.projects', billTheLizardConfig.projects);
    context.set('services.billTheLizard.timeout', billTheLizardConfig.timeout || 0);

    eventService.on(billTheLizardEvents.BILL_THE_LIZARD_REQUEST, (event) => {
      const { query, callId } = event;
      let propName = 'btl_request';
      if (callId) {
        propName = `${propName}_${callId}`;
      }

      pageTracker.trackProp(propName, query);
    });

    eventService.on(billTheLizardEvents.BILL_THE_LIZARD_RESPONSE, (event) => {
      const { response, callId } = event;
      let propName = 'btl_response';
      if (callId) {
        propName = `${propName}_${callId}`;
      }
      pageTracker.trackProp(propName, response);
    });

    cheshireCat.configureCheshireCat(billTheLizardConfig);
    tbViewability.configureTbViewability(billTheLizardConfig);
  },
};

export default billTheLizardWrapper;
