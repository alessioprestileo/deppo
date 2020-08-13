module.exports.handler = async (event, contextIgnored) => {
  try {
    const res = await fetch({
      method: 'POST',
      headers: { ...event.headers, api_key: process.env.DEPPO_BACKEND_API_KEY },
      url: 'http://localhost:5000/v1/create-session',
      body: event.body,
    })

    return {
      statusCode: res.statusCode,
      body: res.body,
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    }
  }
}
