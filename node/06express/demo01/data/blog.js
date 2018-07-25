var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 被允许的Schema类型有String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array, Decimal128, Map
var blogSchema = new Schema ({
  title: String,
  author: String,
  body: String,
  comments: [{
    body: String,
    date: Date
  }],
  date: {
    type: Date,
    default: Date.now
  },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
})

// 要使用定义的Schema，就得把我们得Schema转换为Model
var Blog = mongoose.model('Blog', blogSchema)

var animalSchema = new Schema ({ name: String, type: String })

animalSchema.methods.findSimilarTypes = function (cb) {
  return this.model('Animal').find({ type: this.type }, cb)
}

// 现在所有的animal实例都有findSimilarTypes方法了
var Animal = mongoose.model('Animal', animalSchema)
var dog = new Animal({ type: 'dog'})

dog.findSimilarTypes(function (err, dogs) {
  console.log(dogs)
})

// 添加静态函数
animalSchema.statics.findByName = function (name, cb) {
  return this.find({ name: new RegExp(name, i)}, cb)
}

// 添加查询助手
animalSchema.query.byName = function () {
  return this.where({ name: new RegExp(name, 'i')})
}

var Animal = mongoose.model('Animal', animalSchema)
Animal.findByName('fido', function (err, animals) {
  console.log(animals)
})
Animal.find.byName('fido').exec(function (err, animals) {
  console.log(animals)
})

Animal.findOne().byName('fido').exec( function (err, animal) {
  console.log(animal)
})


// 注意不论是实例方法还是静态方法，都不要使用箭头函数，这样this就不会是外部环境的this



