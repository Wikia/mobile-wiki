import { pageTracker } from '../tracking/page-tracker';
import { cheshireCat } from './cheshire-cat';
import { tbViewability } from './tb-viewability';

export default function configureBillTheLizard(config) {
  const {
    billTheLizardEvents, context, eventService,
  } = window.Wikia.adEngine;

  context.set('services.billTheLizard.projects', config.projects);
  context.set('services.billTheLizard.timeout', config.timeout);

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

  cheshireCat.configure(config);
  tbViewability.configure(config);
}
