import Service from '@ember/service';

export default function (owner) {
  owner.register('service:runtime-config', Service.extend({
    baseDomain: 'foobar',
    servicesDomain: 'foo',
    servicesInternalHost: 'bar',
    servicesExternalHost: 'baz',
  }))
}
