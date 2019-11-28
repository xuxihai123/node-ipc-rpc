module.exports = function(child) {
  // 程序停止信号
  process.on('SIGHUP', function() {
    child.kill('SIGHUP');
    process.exit(0);
  });

  // kill 默认参数信号
  process.on('SIGTERM', function() {
    child.kill('SIGHUP');
    process.exit(0);
  });

  // Ctrl + c 信号
  process.on('SIGINT', function() {
    child.kill('SIGHUP');
    process.exit(0);
  });

  // 退出事件
  process.on('exit', function() {
    child.kill('SIGHUP');
    process.exit(0);
  });
};
