const { MemoApi } = require('./dist')
const app = new MemoApi()
app.listen({
  port: 4000,
  logger: true,
  hosts: ["192.168.10.245:4000", "localhost:4000"],
})

app.get('/', (req, res) => {
  res.end("Hello MemoApi!")
})

app.get('/user', (req, res) => {
  console.log(req.query);
  res.end("Hello MemoApi!")
})

app.post('/user', (req, res) => {
  console.log(req.body);
  res.end("Hello MemoApi!")
}, {
  schema: {
    body: {
      name: {
        type: String,
        length: [2, 10]
      },
      password: {
        type: String,
        length: [8, 16],
        default: "lorre0322@foxmail.com"
      },
      email: {
        type: String,
        RegExp: /^[^\s@]+@[^\s@]+\.[a-zA-Z0-9]+(\.[a-zA-Z]{2,})?$/,
        length: [8, 25]
      },
      date: {
        type: Object,
        default: new Date
      }
    },
    require: ["name", "password"]
  }
})