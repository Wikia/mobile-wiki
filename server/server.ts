/// <reference path="../typings/node/node.d.ts" />

// This script will boot app.js with the number of workers
// specified in WORKER_COUNT.
//
// The master will respond to SIGHUP, which will trigger
// restarting all the workers and reloading the app.

import cluster = require('cluster');
import localSettings = require('../config/localSettings');
import logger = require('./lib/Logger');

var isStopping = false;

cluster.setupMaster({
	exec: __dirname + '/app.js'
});

// Gets the count of active workers
function numWorkers(): number {
	return Object.keys(cluster.workers).length;
}

// Forks off the workers unless the server is stopping
function forkNewWorkers(): void {
	if (!isStopping) {
		for (var i = numWorkers(); i < localSettings.workerCount; i++) {
			cluster.fork();
		}
	}
}

// Stops a single worker
// Gives workerDisconnectTimeout seconds after disconnect before SIGTERM
function stopWorker(worker: cluster.Worker): void {
	logger.info('stopping', worker.process.pid, 'timeout', localSettings.workerDisconnectTimeout);

	worker.send('shutdown');
	worker.disconnect();

	var killTimer= <any>setTimeout(() => {
		worker.kill();
	}, localSettings.workerDisconnectTimeout);

	worker.on('disconnect',(): void => {
		logger.info('Worker disconnected', worker.process.pid);
		<any>clearTimeout(killTimer);
		worker.kill();
	});

	// Ensure we don't stay up just for this setTimeout
	killTimer.unref();
}

// Stops all the workers at once
function stopAllWorkers(): void {
	isStopping = true;

	logger.info('stopping all workers');
	Object.keys(cluster.workers).forEach((id: any) => {
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

logger.info('Master process', process.pid, 'booted');

//if run as child
//send up message from workers so we can now that they are up
if (process.send) {
	cluster.on('online', (worker: cluster.Worker) => {
		worker.on('message', (message: string) => {
			process.send(message);
		});
	});
}
