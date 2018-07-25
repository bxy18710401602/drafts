module.exports = function (options) {
  console.log(options.option1 + options.option2)
  return function (req, res, next) {
    next()
  }
}