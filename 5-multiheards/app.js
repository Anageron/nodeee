const { performance, PerformanceObserver } = require("perf_hooks");
const { Worker } = require("worker_threads");
const os = require("os");

const performanceObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration} ms`);
  });
});
performanceObserver.observe({ entryTypes: ["measure"] });

const arr = Array.from({ length: 300_000 }, (_, i) => i + 1);

const numThreads = os.cpus().length;
const chunkSize = Math.ceil(arr.length / numThreads);
const chunks = [];
for (let i = 0; i < arr.length; i += chunkSize) {
  chunks.push(arr.slice(i, i + chunkSize));
}

const line = () => {
  performance.mark("linear start");
  const count = arr.filter(el => el % 3 === 0).length;
  performance.mark("linear end");
  performance.measure("Linear approach", "linear start", "linear end");
  console.log("Linear total:", count);
};

const runWorker = (chunk) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__dirname + "/worker.js", {
      workerData: chunk,
    });
    worker.on("message", resolve);
    worker.on("error", reject);
  });
};

const main = async () => {
  line(); 

  performance.mark("parallel start");
  const results = await Promise.all(chunks.map(runWorker));
  const totalCount = results.reduce((a, b) => a + b, 0);
  performance.mark("parallel end");
  performance.measure("Parallel approach", "parallel start", "parallel end");

  console.log("Parallel total:", totalCount);
};

main();