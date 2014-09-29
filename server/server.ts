/// <reference path="../typings/node/node.d.ts" />

// This script will boot app.js with the number of workers
// specified in WORKER_COUNT.
//
// The master will respond to SIGHUP, which will trigger
// restarting all the workers and reloading the app.

import cluster = require('cluster');
import localSettings = require('../config/localSettings');
import logger = require('./lib/Logger');

var stopping = false,
	// A list of workers queued for a restart
	workersToStop: Array<string> = [];

cluster.setupMaster({
	exec: __dirname + '/app.js'
});

// Gets the count of active workers
function numWorkers(): number {
	return Object.keys(cluster.workers).length;
}

// Forks off the workers unless the server is stopping
function forkNewWorkers(): void {
	if (!stopping) {
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

	var killTimer= <any>setTimeout(function () {
		worker.kill();
	}, localSettings.workerDisconnectTimeout);

	worker.on('disconnect', function(): void {
		logger.info('Worker disconnected', worker.process.pid);
		<any>clearTimeout(killTimer);
		worker.kill();
	})

	// Ensure we don't stay up just for this setTimeout
	killTimer.unref();
}

// Tell the next worker queued to restart to disconnect
// This will allow the process to finish it's work
// for 60 seconds before sending SIGTERM
function stopNextWorker(): void {
	var i = <any>workersToStop.pop(),
		worker = cluster.workers[i];

	if (worker) {
		stopWorker(worker);
	}
}

// Stops all the workers at once
function stopAllWorkers(): void {
	stopping = true;

	logger.info('stopping all workers');
	Object.keys(cluster.workers).forEach(function (id: any):void {
		stopWorker(cluster.workers[id]);
	});
}

// Worker is now listening on a port
// Once it is ready, we can signal the next worker to restart
cluster.on('listening', stopNextWorker);

// A worker has disconnected either because the process was killed
// or we are processing the workersToStop array restarting each process
// In either case, we will fork any workers needed
cluster.on('disconnect', forkNewWorkers);

// HUP signal sent to the master process to start restarting all the workers sequentially
process.on('SIGHUP', function (): void {
	logger.info('restarting all workers');

	workersToStop = Object.keys(cluster.workers);
	stopNextWorker();
});

// Kill all the workers at once
process.on('SIGTERM', stopAllWorkers);

// Fork off the initial workers
forkNewWorkers();

logger.info('Master process', process.pid, 'booted');

//if run as child
//send up message from workers so we can now that they are up
if (process.send) {
	cluster.on('online', function (worker: cluster.Worker) {
		worker.on('message', function (message: string) {
			process.send(message);
		});
	});
}
