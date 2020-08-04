import { Promise } from 'rsvp';

class PromiseLock {
  constructor() {
    this.value = undefined;
    this.isLoaded = false;
    this.finished = new Promise((resolve, reject) => {
      this.resolve = (x) => {
        this.isLoaded = true;
        this.value = x;
        resolve(x);
      };
      this.reject = (x) => {
        reject(x);
      };
    });
  }
}

export default PromiseLock;
