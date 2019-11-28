const uuid = require("uuid/v4");

class Rpc {
  constructor(ipc, channel = "", label) {
    this.channel = channel || "default";
    this.timeout = 5000;
    this.callbacks = {};
    this.handlers = {};
    this.timeouts = {};
    this.client = ipc;
    this.label = label;

    this.commandEvent = `${this.channel}:cmd`;
    this.replyEvent = `${this.channel}:res`;
    ipc.on("message", this.onMessage.bind(this));
  }
  onMessage(data) {
    if (data.event === this.commandEvent) {
      this.onCommand(data);
    } else if (data.event === this.replyEvent) {
      this.onReply(data);
    } else {
      console.log("other message");
    }
  }
  onCommand(data) {
    const { seq, api, params } = data;
    const handler = this.handlers[api];
    if (!handler) {
      throw Error("rpc call is not exist!!!");
    }
    function finished(err, res) {
      const rpcBody = { event: this.replyEvent, seq, err, res };
      this.client.send(rpcBody, null, { keepOpen: true }, function(err2) {
        if (err2) {
          callback(err2);
        }
      });
    }
    handler(params, finished.bind(this));
  }
  onReply(data) {
    const { seq, err, res } = data;
    if (this.callbacks[seq]) {
      clearTimeout(this.timeouts[seq]);
      const callback = this.callbacks[seq];
      delete this.callbacks[seq];
      delete this.timeouts[seq];
      callback(err, res);
    }
  }
  register(api, handler) {
    this.handlers[api] = handler;
  }
  call(api, params) {
    return new Promise((resolve, reject) => {
      this.callAsync(api, params, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
  callAsync(api, params, callback) {
    const seq = uuid();

    if (typeof params === "function") {
      callback = params;
      params = [];
    }
    if (callback) {
      this.callbacks[seq] = callback;
      this.timeouts[seq] = setTimeout(() => {
        const callback = this.callbacks[seq];
        delete this.callbacks[seq];
        callback(new Error("timeout"));
      }, this.timeout);
    }
    const rpcBody = { event: this.commandEvent, seq, api, params };
    this.client.send(rpcBody, null, { keepOpen: true }, function(err) {
      if (err) {
        callback(err);
      }
    });
  }
}

module.exports = Rpc;
