import { defer } from 'rsvp';

let fanTakeoverDeferred;
let resolved;

function reset () {
  fanTakeoverDeferred = defer();
  resolved = false;
}

reset();

export default {
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
    const { universalAdPackage } = window.Wikia.adProducts;

    fanTakeoverDeferred.resolve(universalAdPackage.isFanTakeoverLoaded());
    resolved = true;
  },

  onRenderEnded() {
    if (!this.isResolved()) {
      this.resolve();
    }
  }
};
