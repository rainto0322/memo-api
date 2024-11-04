export const log = (message) => {
  console.log(message)
}

export const LOG = {
  GET: m => `[42m ${m} [0m`,
  POST: m => `[41m ${m} [0m`,
  PUT: m => `[43m ${m} [0m`,
  DELETE: m => `[41m ${m} [0m`,
  URL: m => `[93m ${m} [0m`
}