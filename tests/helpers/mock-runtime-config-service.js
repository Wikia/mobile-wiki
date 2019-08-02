export default function (owner) {
  const runtimeConfig = owner.lookup('service:runtime-config');
  runtimeConfig.servicesExternalHost = 'http://services.test';
}
