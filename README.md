<div align="center">

[<img src="./assets/logo.png" width="100" height="100" alt="Logo">](https://github.com/rainto0322)

</div>
<p align="center">🌷 Fast and minimalist web server , for Node.js .</p></br>
<p align="center">
    <a href="https://github.com/discussjs/discuss/releases/"><img src="https://img.shields.io/npm/v/discuss?color=critical&logo=npm" alt="Version"></a>
    <img src="https://img.shields.io/npm/dm/memo-api" alt="Downloads">
    <a href="https://jq.qq.com/?_wv=1027&k=lh7oS7Xt"><img src="https://img.shields.io/badge/Tim-693739563-00a4ff?logo=tencent-qq" alt="QQ群"></a>
    <a href="https://github.com/discussjs/discuss/blob/dev/LICENSE"><img src="https://img.shields.io/npm/l/discuss?color=ee5535" alt="MIT License"></a>

</p>


## Table of contents
* [Installation](#Installation)
* [Configure](#Configure)
* [Dynamic Routing](#Dynamic-Routing)
* [Verify schema](#Verify-schema)

```js
// index.js
const MemoApi = require('./src/core')
const app = new MemoApi()

app.get('/', function (req, res) {
  res.end('Hello World')
})

app.listen({ port:4000 })
```

## Installation
Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install memo-api
```

## Configure

```js
app.listen({
  // listen port
  port:4000,
  // console log
  logger:true,
  // domain whitelist
  hosts:["localhost:4000","192.168.10.123"],
  // body max size
  limit: 10000
})
```

## Dynamic Routing
> It should be noted that routing has an execution order, from front to back

```js
app.get('/user/:name', function (req, res) {
  const { name } = req.params
  // "/user/rainto?id=123456"
  // If there are parameters like 'id' in the link
  const { id } = req.query
  res.end(`Hello ${name}` )
})
```

## Verify schema
The schema validation method is more like Fascify.
```js
const schema = {
  body: {
    name:{
      type: String
      // default
      default: "rainto"
    },
    email: {
      // type
      type: String,
      // regular expression
      RegExp: /^[^\s@]+@[^\s@]+\.[a-zA-Z0-9]+(\.[a-zA-Z]{2,})?$/,
      // [minLength,maxLength]
      length: [8,25]
    },
  },
  // required options 
  require:["email"]
}

app.post('/',(req,res)=>{
  res.end(JSON.stringify(req.body))
},{ schema: signup_schema })
```
