exports.syshello = async function(params) {
  return "syshello get ..." + JSON.stringify(params);
};
exports.sum = async function(params) {
  const list = params;

  const sum = list.reduce((val, item) => {
    return val + item;
  }, 0);
  return "sum: " + sum;
};
