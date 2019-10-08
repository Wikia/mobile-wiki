import { defer } from 'rsvp';

let fanTakeoverDeferred;
let resolved;

function reset() {
  fanTakeoverDeferred = defer();
  resolved = false;
}

reset();

export const fanTakeoverResolver = {
  isEnabled() {
    return true;
  },

  isResolved() {
    return resolved;
  },

  getPromise() {
    return fanTakeoverDeferred.promise;
  },

  reset,

  resolve() {
    if (this.isResolved()) {
      return;
    }

    const { universalAdPackage } = window.Wikia.adProducts;

    fanTakeoverDeferred.resolve(universalAdPackage.isFanTakeoverLoaded());
    resolved = true;
  },
};

export default fanTakeoverResolver;
