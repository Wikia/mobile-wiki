import { Communicator, setupPostQuecast } from '@wikia/post-quecast';

class CommunicationService {
  /**
   * @private
   */
  communicator;

  constructor() {
    if (typeof FastBoot === 'undefined') {
      setupPostQuecast();
      this.communicator = new Communicator();
    }
  }

  addListener(cb) {
    if (this.communicator) {
      this.communicator.actions$.subscribe(cb);
    }
  }

  // removeListener(cb) {
  //   return;
  // }

  dispatch(action) {
    if (this.communicator) {
      action.__global = true;
      this.communicator.dispatch(action);
    }
  }
}

export const communicationService = new CommunicationService();

export default communicationService;
