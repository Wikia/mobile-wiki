import Service from '@ember/service';
import { v4 as uuid } from 'ember-uuid';
import { computed } from '@ember/object';

export default Service.extend({
  initialTraceId: computed(() => uuid()),

  getTraceId(isInitialLoad) {
    return isInitialLoad ? this.initialTraceId : uuid();
  },
});
