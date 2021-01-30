exports.errorMsg = async (msg, res) => {
  return res.status(400).send(msg);
};

exports.fieldRes = async (msg, res) => {
  return res.send(msg);
};
