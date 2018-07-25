// 在Mongoose中，所有事物都衍生自Schema
var kittySchema = mongoose.Schema({
  name: String
})

// 给Schema实例添加方法
kittySchema.methods.speak = function () {
  var greeting = this.name
      ? 'Meow name is ' + this.name
      : 'I don\'t have a name'
  console.log(greeting)
}

// 将Schema实例编译为model
var Kitten = mongoose.model('Kitten', kittySchema)

var silence = new Kitten({
  name: 'Silence'
})
console.log(silence.name, '小猫的名字')
var fluffy = new Kitten({ name: 'fluffy' })
fluffy.speak()

Kitten.find(function (err, kittens) {
  if (err) {
    return console.error(err)
  } else {
    console.log(kittens.toString(), '所有的猫咪')
  }
})
// 筛选数据
Kitten.find({ name: /^fluff/ }, function (err, kittens) {
  console.log(kittens.toString())
})