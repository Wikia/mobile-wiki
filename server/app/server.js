/**
 * This is the main server script.
 *
 * This script will boot app.js with the number of workers
 * specified in WORKER_COUNT.
 */

import cluster from 'cluster';
import settings from '../config/settings';
import logger from './lib/logger';

/**
 * Is the application stopping
 * @type {boolean}
 */
let isStopping = false;

cluster.setupMaster({
	exec: `${__dirname}/app.js`
});

/**
 * Gets the count of active workers
 *
 * @returns {number} Current number of workers
 * @returns {number}
 */
function numWorkers() {
	return Object.keys(cluster.workers).length;
}

/**
 * Forks off the workers unless the server is stopping
 * @returns {void}
 */
function forkNewWorkers() {
	if (!isStopping) {
		for (let i = numWorkers(); i < settings.workerCount; i++) {
			cluster.fork();
		}
	}
}

/**
 * Stops a single worker
 * Gives workerDisconnectTimeout seconds after disconnect before `SIGTERM`
 *
 * @param {cluster.Worker} worker
 * @returns {void}
 */
function stopWorker(worker) {
	logger.info('Stopping worker');

	worker.send('shutdown');
	worker.disconnect();

	/**
	 * @returns {void}
	 */
	const killTimer = setTimeout(() => {
		worker.kill();
	}, settings.workerDisconnectTimeout);

	/**
	 * @returns {void}
	 */
	worker.on('disconnect', () => {
		logger.info('Worker disconnected');
		clearTimeout(killTimer);
		worker.kill();
	});

	// Ensure we don't stay up just for this setTimeout
	killTimer.unref();
}

/**
 * Stops all the workers at once
 * @returns {void}
 */
function stopAllWorkers() {
	isStopping = true;

	logger.info('Stopping all workers');

	/**
	 * @param {*} id
	 * @returns {void}
	 */
	Object.keys(cluster.workers).forEach((id) => {
		stopWorker(cluster.workers[id]);
	});
}

// A worker has disconnected either because the process was killed
// or we are processing the workersToStop array restarting each process
// In either case, we will fork any workers needed
cluster.on('disconnect', forkNewWorkers);

// Kill all the workers at once
process.on('SIGTERM', stopAllWorkers);

// Fork off the initial workers
forkNewWorkers();

logger.info('Master process booted');

// if run as child
// send up message from workers so we can now that they are up
if (process.send) {
	/**
	 * @param {cluster.Worker} worker
	 * @returns {void}
	 */
	cluster.on('online', (worker) => {
		/**
		 * @param {*} message
		 * @returns {void}
		 */
		worker.on('message', (message) => {
			process.send(message);
		});
	});
}
