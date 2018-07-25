//使用domain模块创建一个子域，在子域内运行的代码可以随意抛出异常，这些异常可以通过子域对象的error事件统一捕获
function async (request, callback) {
  // Do something
  asyncA (request, function (data) {
    // Do something
    asyncB (request, function (data) {
      // Do somthing 
      // ...callback
    })
  })
}
http.createServer(function (request, response) {
  var d = domain.create()

  d.on('error', function (){
    response.writeHead(500)
    response.end()
  })
  d.run(function () {
    async(request, function (data) {
      response.writeHead(200)
      response.end(data)
    })
  })
})