module.exports.handler = async (eventIgnored, contextIgnored) => ({
  statusCode: 200,
  body: JSON.stringify({
    USELESS_VAR: process.env.USELESS_VAR,
  }),
})
