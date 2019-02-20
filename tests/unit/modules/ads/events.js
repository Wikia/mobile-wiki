export class Events {
  constructor() {
    this.events = {};

    this.PAGE_RENDER_EVENT = 'page_render';
    this.AD_SLOT_CREATED = 'ad_slot_created';
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

export default new Events();
