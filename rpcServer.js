const Rpc = require("./Rpc");
const modules = require("./modules");

// 子进程是服务进程
const rpcServerInstance = new Rpc(process, "sos", "rpcServer");

console.info(`${rpcServerInstance.label}:${process.pid}`);

Object.keys(modules).forEach(moduleName => {
  const moduleObj = modules[moduleName];
  const methods = Object.keys(moduleObj);
  methods.forEach(method => {
    const handler = moduleObj[method].bind(moduleObj);
    const api = `${moduleName}.${method}`;
    console.info("rpcServer register:" + api);
    rpcServerInstance.register(api, async function(params, callback) {
      try {
        const result = await handler(params);
        console.log(result);
        callback(null, result);
      } catch (err) {
        console.log(err);
        callback(err);
      }
    });
  });
});
