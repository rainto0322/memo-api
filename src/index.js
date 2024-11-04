
import http from 'http'
import { get_body, get_query, get_params } from './utils/get-body'
import { get_type } from './utils/get_type'
import { verify } from './utils/verify'
import { log, LOG } from './utils/log'

export class MemoApi {
  constructor() {
    this.config = {
      port: 4000,
      hosts: [],
      logger: true,
      limit: null
    }
    this.routes = []
    this.methods = ['GET', 'POST', 'PUT', 'DELETE']
    this.methods.forEach(method => {
      this[method.toLowerCase()] = (path, callback, option) => {
        this.addRoute(path, method, callback, option)
      }
    })
  }

  addRoute(path, method, callback, option) {
    let route = { path, method, callback, option }
    let params = []

    // Get routing parameters
    if (path.includes(':') && path !== "/:") {
      route.path = new RegExp('^' + path.replace(/:([^\/]*)/g, (match, ele) => {
        params.push(ele)
        return '([^\\/]*)'
      }) + '$')
      route.path.params = params
    }
    this.routes.push(route)
  }

  // Register routing array
  register(registration) {
    registration(this)
  }

  async errorHandle(error, res) {
    res.statusCode = error.code
    console.error(error.message)
    res.end(JSON.stringify({
      code: error.code || 400,
      error: error.message
    }))
  }

  replyHandle(res) {
    const originalEnd = res.end
    res.end = function (data, encoding, callback) {
      if (typeof data === 'object' && !Buffer.isBuffer(data)) {
        data.code = 200
        data.ok = true
        data = JSON.stringify(data)
      }
      originalEnd.call(res, data, encoding, callback)
    }
  }

  // Verify request body to remove redundant parameters
  async preHandle(req, res, route) {
    this.replyHandle(res)
    try {
      if (route.option) {
        const { schema } = route.option
        const validata = verify(schema)
        const data = await validata(req.body)
        if (data) req.body = data
        return route.callback(req, res)
      } else {
        return route.callback(req, res)
      }
    } catch (error) {
      error.code = 400
      await this.errorHandle(error, res)
    }
  }

  // Execute according to the route
  async routeHandle(req, res) {
    const { method, headers, url } = req;
    const { pathname } = new URL(url, `http://${headers.host}`)

    for (const route of this.routes) {
      if (route.method === method) {
        const { path } = route
        // Dynamic routing
        const matches = pathname.match(path)
        if (matches) {
          if (path.params) {
            req.params = await get_params(path, matches)
            return this.preHandle(req, res, route)
          }
        }

        // Static routing
        if (route.path === pathname) {
          return this.preHandle(req, res, route)
        }
        // Static files
        if (route.path === "/:") {
          return this.preHandle(req, res, route)
        }
      }
    }
  }

  // Check domain whitelist
  allowedHosts(req, res) {
    const { hosts } = this.config
    const { host } = req.headers
    if (hosts.length !== 0 && !hosts.includes(host)) {
      const error = new Error("=͟͟͞͞ʕ•̫͡•ʔ=͟͟͞͞  Sorry, you are not on the domain whitelist !")
      error.code = 403
      res.end(error)
    }
  }

  // Initial service
  async Initial(req, res) {
    const { limit } = this.config
    const startTime = performance.now()
    this.allowedHosts(req, res)
    // Set response header
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Content-Type', `${get_type(req)}; charset=utf-8`)

    // Get Request Body
    try {
      req.query = await get_query(req)
      req.body = await get_body(req, res, limit)
      await this.routeHandle(req, res)
    } catch (error) {
      res.end(error.message)
    } finally {
      const { logger } = this.config
      // Console log
      if (logger) {
        const { method, url, headers } = req
        const { pathname } = new URL(url, `http://${headers.host}`)
        const interval = (performance.now() - startTime).toFixed(2)
        console.log(LOG[method](method), LOG.URL(pathname), ` Took${LOG.URL(interval)}ms`)
      }
    }
  }

  // Basic Settings
  configure(options) {
    for (const key in options) {
      if (this.config.hasOwnProperty(key)) {
        this.config[key] = options[key]
      }
    }
  }

  // Listen port & set config
  listen(options, callback) {
    this.configure(options)
    const { port } = this.config
    const server = http.createServer(this.Initial.bind(this))
    log(`[45m ʕ•̮͡•ʔ丿Service is running on port [41m ${port} [0m`)
    server.listen(port, callback)
  }
}