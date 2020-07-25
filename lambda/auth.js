module.exports.handler = async (eventIgnored, contextIgnored) => {
  try {
    const res = await fetch({
      method: 'GET',
      headers: { api_key: process.env.DEPPO_BACKEND_API_KEY },
      url: 'http://localhost:5000/v1',
    })

    return {
      statusCode: res.statusCode,
      body: res.body,
    }
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    }
  }
}
