
class MyPromise {
  constructor(executor) {
    // 初始化 status 为等待态
    this.status = 'pending';
    // 成功的值
    this.value = undefined;
    // 失败的原因
    this.reason = undefined;

    // 成功存放的数组
    this.onResloveCallbacks = [];
    // 失败存放的数组
    this.onRejectCallbacks = [];

    let resolve = value => {
      // 如果状态已经是成功态，则不再执行
      if (this.status === 'pending') {
        // resolve 调用用，state 状态改为成功态
        this.status = 'fulfilled';
        // 储存成功的值
        this.value = value;
        // 一旦resolve执行，调用成功数组的函数
        this.onResloveCallbacks.forEach(fn => fn());
      }
    };
    let reject = reason => {
      // 如果状态已经是失败态，则不再执行
      if (this.status === 'pending') {
        // reject 调用用，state 状态改为失败态
        this.status = 'rejected';
        // 储存失败的原因
        this.reason = reason;
        // 一旦reject执行，调用失败数组的函数
        this.onRejectCallbacks.forEach(fn => fn());
      }
    };

    // 执行executor函数，报错直接执行 reject
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled 如果不是函数，就忽略 onFulfilled
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // onRejected 如果不是函数，就忽略 onRejected
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };


    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            // resolvePromise 函数，处理自己 return 的 promise 和默认的 promise2 的关系
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0)
      }
      if (this.status === 'pending') {
        // onFulfilled 传入到成功数组
        this.onResloveCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        // onRejected 传入到失败数组
        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    return promise2
  }


}

function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    // reject 报错
    return reject(new TypeError('循环引用'));
  }
  // 防止多次调用
  let called;
  // x 不是 null 且 x 是对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // 尝试调用 x 的 then 方法
      let then = x.then;
      // 如果 x.then 是函数，则调用 x.then
      if (typeof then === 'function') {
        // 如果 then 方法返回的是一个 promise，则等待 promise 的状态
        then.call(x, y => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          // resolve 结果依旧是 promise 那就继续解析
          resolvePromise(promise2, y, resolve, reject);
        }, err => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          reject(err);
        })
      } else {
        resolve(x);
      }
    } catch (err) {
      // 属于失败
      if (called) return;
      called = true;
      // 如果 x.then 报错，则不要在继续执行了
      reject(err);
    }
  } else {
    resolve(x);
  }
}

MyPromise.resolve = function (val) {
  return new MyPromise((resolve, reject) => {
    resolve(val);
  });
}

MyPromise.reject = function (val) {
  return new MyPromise((resolve, reject) => {
    reject(val);
  });
}

MyPromise.race = function (promises) {
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject)
    }
  })
}

// all
MyPromise.all = function (promises) {
  let arr = [];
  let i = 0;
  function processData(index, data) {
    arr[index] = data;
    i++;
    if (i === promises.length) {
      resolve(arr);
    }
  }
  return new MyPromise((resolve, reject) => {
    promises.forEach((promise, index) => {
      promise.then(data => {
        processData(index, data);
      }, reject)
    })
  });
}

MyPromise.deferred = MyPromise.defer = function () {
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = MyPromise