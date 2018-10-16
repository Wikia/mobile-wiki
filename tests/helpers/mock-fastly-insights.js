import Service from '@ember/service';

export default function (owner) {
  owner.register('service:fastly-insights', Service.extend({
    loadFastlyInsightsScript() {},
  }));
}
