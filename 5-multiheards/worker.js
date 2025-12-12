const { parentPort, workerData } = require('worker_threads');
const { countDivisibleByThree } = require('./countDivisibleByThree');

parentPort.postMessage(countDivisibleByThree(workerData))
