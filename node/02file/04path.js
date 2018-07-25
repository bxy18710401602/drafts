const path = require('path')
let cache = {}

function store(key, value) {
  cache[path.normalize(key)] = value
}

store('foo/bar', 1)
store('foo/./baz//../bar', 2)
store('foo/./../bar/test', 3)

path.join('/test', '/a', '../b')
console.log(cache)
console.log(path.join('/test', '/a', '/b', '../c'))
console.log(path.extname('foo/bar.js'))