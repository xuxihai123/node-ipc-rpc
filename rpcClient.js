const Rpc = require("./Rpc");

const rpcWrapper = {
  init: function(childProcess) {
    const instance = new Rpc(childProcess, "sos", "rpcClient");
    this._rpcInstance = instance;
    console.info(`${instance.label}:${process.pid}`);
  },
  call: async function(api, params) {
    const instance = this._rpcInstance;
    if (!instance) {
      throw Error("please init RpcClient");
    }
    const result = await instance.call(api, params);
    return result;
  }
};

module.exports = rpcWrapper;
