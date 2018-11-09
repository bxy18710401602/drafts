let fs = require('fs')
let path = require('path')
console.log(process.argv, 'process.argv')
let args = process.argv.splice(2)
console.log(args, 'args')
let command = args.shift()
let taskDescription = args.join(' ')
let file = path.join(process.cwd(), '/.tasks')

switch (command) {
  case 'list': 
    listTasks(file)
    break
  case 'add':
    addTask(file, taskDescription)
    break
  default: 
    console.log('Usage: ' + process.argv[0] + ' list | add [taskDescription]')
}

function loadOrInitializeTaskArray (file, cb) {
  fs.exists(file, function (exists) {
    var tasks = []
    if (exists) {
      fs.readFile(file, 'utf8', function (err, data) {
        if (err) throw err
        let data = data.toString()
        tasks = JSON.parse(data || '[]')
        cb(tasks)
      })
    } else {
      cb([])
    }
  })
}

function listTasks(file) {
  loadOrInitializeTaskArray(file, function (tasks) {
    for (let i in tasks) {
      console.log(tasks[i])
    }
  })
}

function storeTasks (file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
    if (err) throw err
    console.log('Saved')
  })
}

function addTask(file, taskDescription) {
  loadOrInitializeTaskArray(file, function(tasks) {
    tasks.push(taskDescription)
    storeTasks(file, tasks)
  })
}