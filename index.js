const fork = require("child_process").fork;
const path = require("path");
const rpcClient = require("./rpcClient");
const secureExit = require("./secureExit");

const workerPath = path.resolve(__dirname, "worker.js");
const cwd = process.cwd();

let retry = 0;

function forkWorker() {
  const child = fork(workerPath, {
    cwd: cwd,
    silent: false
  });
  return child;
}

let childProcess = forkWorker();
secureExit(childProcess);
rpcClient.init(childProcess);

setInterval(() => {
  test();
}, 3000);

function test() {
  rpcClient
    .call("test.syshello", "lucy")
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err.message);
    });

  rpcClient
    .call("test.sum", [1, 2, 3, 4, 5])
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err.message);
    });
}
