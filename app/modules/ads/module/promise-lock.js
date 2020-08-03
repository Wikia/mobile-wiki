export default class PromiseLock {
  constructor() {
    this.isLoaded = false;
    this.finished = new Promise((resolve, reject) => {
      this.resolve = (x) => {
        this.isLoaded = true;
        resolve(x);
      };
      this.reject = (x) => {
        reject(x);
      };
    });
  }
}
