export const events = {
  PAGE_RENDER_EVENT: Symbol('page_render'),
  AD_SLOT_CREATED: Symbol('AD_SLOT_CREATED'),
};

export class EventService {
  constructor() {
    this.events = {};
  }

  on(eventName, eventCb) {
    if (eventName in this.events) {
      this.events[eventName].push(eventCb);
    } else {
      this.events[eventName] = [eventCb];
    }
  }

  emit(eventName, ...options) {
    this.events[eventName].forEach(cb => cb(...options));
  }
}
