function Promise (fn) {
  /**
   * 省略非new实例化方式处理
   * 省略fn非函数异常处理
   */
  
  /**
   * promise状态变量
   * 0: pending
   * 1: fufilled
   * 2: rejected
   */

   this._state = 0;
   // promise执行结果
   this._value = null;

   // then(..)注册回调处理数组，为满足多次调用then注册回调处理，内部选用_deffereds数组存储处理对象
   this._deffereds = [];

   // 立即执行fn函数
   try {
     fn(value => {
       resolve(this, value)
     }, reason => {
       reject(this, reason)
     })
   } catch (err) {
     // 处理只执行异常
     reject(this, err);
   }

}

Promise.prototype.then = function (onResolved, onRejected) {
  var res = new Promise(function () {});
  // 使用onResolved、onRejected实例化处理对象Handler
  var defferred = new Handler(onResolved, onRejected, res);

  // 当前状态为pendding，存储延迟处理对象
  if (this._state === 0) {
    this._deferreds.push(defferred);
    return res
  }
  // 当前promise状态不为pendding，调用handleResolved执行onResolved或者onRejected回调
  handleResolved(this, deferred);
  // 返回promise对象，吃醋链式调用
  return res
}

// Handler函数封装存储onResolved、onRejected函数和生成promise对象
function Handler (onResolved, onRejected, promise) {
  this.onResolved = typeof onResolved === 'function' ? onResolved : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise
}

function resolve (promise, value) {
  // 非pending状态不可变
  if (promise._state !== 0) return
  
  // promise和value指向同一对象
  if (value === promise) {
    return reject(promise, new TypeError('A promise cannot be resolved with itself.'))
  }

  // 如果value为Promise，则使promise接受value状态
  if (value && value instanceof Promise && value.then === promise.then) {
    var deferreds = promise._deferreds

    if (value._state === 0) {
      value._deferreds.push(...deferreds)
    } else if (deferreds.length !== 0){
      for (var i = 0; i < deferreds.length; i++) {
        handleResolved(value, deferreds[i])
      }

      // 清空then注册回调函数
      value._deferreds = []
    }
    return
  }

  // value是对象或函数
  if (value && (typeof value === 'object' || typeof value === 'function')) {
    try {
      var then = obj.then
    } catch (err) {
      return reject(promise, err)
    }

    // 如果then是函数，将value作为函数的作用域this调用之
    if (typeof then === 'function') {
      try {
        // 执行then函数
        then.call(value, function (value) {
          resolve(promise, value)
        }, function (reason) {
          reject(promise, reason)
        })
      } catch (err) {
        reject(promise, err)
      }
      return
    }
  }

  // 改变promise内部状态为'resolved'
  promise._state = 1
  promise._value = value

  // promise存在then注册回调函数
  if (promise._deferreds.length !== 0) {
    for (var i = 0; i < promise._deferreds.length; i++) {
      handleResolved(promise, promise._deferreds[i])
    }
    // 清空then注册回调函数
    promise._deferreds = []
  }
}

function reject (promise, reason) {
  // 非pending状态不可变
  if (promise._state !== 0) return

  // 改变promise内部状态为'rejected'
  promise._state = 2
  promise._value = reason

  // 判读是否存在then注册回调函数
  if (promise._deferreds.length !== 0) {
    // 异步执行回调函数
    for (var i = 0; i < promise._deferreds.length; i++) {
      handleResolved(promise, promise._deferreds[i])
    }
    promise._deferreds = []
  }
}

function handleResolved (promise, deferred) {
  // 异步执行注册回调
  asyncFn(function () {
    var cb = promise._state === 1 ?
            deferred.onResolved : deferred.onRejected
    // 传递注册回调函数为空的情况
    if (cb === null) {
      if (promise._state === 1) {
        resolve(deferred.promise, promise._value)
      } else {
        reject(deferred.promise, promise._value)
      }
      return
    }

    // 执行注册回调操作
    try {
      var res = cb(promise._value)
    } catch (err) {
      reject(deferred.promise, err)
    }

    // 处理链式then()注册函数调用
    resolve(deferred.promise, res)
  })
}