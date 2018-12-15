require("ts-node/register");

const { setup } = require("./setup");

module.exports = async function() {
  // Call your initialization methods

  await setup();
  return null;
};
