const http = require('http')
const work = require('./lib/timetrack')
const mysql = require('mysql')

let db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '9980253az',
  database: 'timetrack'
})

let server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'POST':
      switch (req.url) {
        case '/':
          work.add(db, req, res)
          break
        case '/archive':
          work.archive(db, req, res)
          break
        case '/delete':
          work.delete(db, req, res)
          break
      }
      break
    case 'GET':
      switch (req.url) {
        case '/':
          work.show(db, res)
          break
        case '/archived':
        
      }
  }
})