// Get query parameters
export const get_query = async (req) => {
  const { headers, url } = req
  const { searchParams } = new URL(url, `http://${headers.host}`)
  if (searchParams.length > 0) {
    const query = {}
    searchParams.forEach((value, key) => {
      query[key] = value
    })
    return query
  }
}

// Get params parameters
export const get_params = async (path, matches) => {
  const params = {}
  path.params.forEach((param, index) => {
    params[param] = matches[index + 1]
  })
  return params
}

// Get body data
export const get_body = async (req, res, limit) => {
  return new Promise((resolve) => {
    let data = []
    req.on('data', (chunk) => {
      data.push(chunk)
    })
    req.on('end', () => {
      data = Buffer.concat(data).toString()
      if (!data) return resolve({})
      if (limit !== null && data.length > limit) {
        res.statusCode = 413
        res.end(JSON.stringify({
          ok: false,
          error: "ʕ•̫͡•ʔ Request entity is too large."
        }))
      }
      try {
        resolve(JSON.parse(data))
      } catch (error) {
        console.error(error)
        resolve({})
      }
    })
  })
}