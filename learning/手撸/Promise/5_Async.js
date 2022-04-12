
/**
 * 目标：
 * 1. 实现 Promise 支持异步操作
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.err = undefined

    // 支持链式操作，储存回调时要改为使用数组
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    let resolve = (value) => {
      // 如果当前状态是 pending，才去执行逻辑并改变状态为 fulfilled
      if (this.status === PENDING) {
        setTimeout(() => {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach((fn) => fn());
        }, 0);
      }
    };

    let reject = (err) => {
      // 如果当前状态是 pending，才去执行逻辑并改变状态为 rejected
      if (this.status === PENDING) {
        setTimeout(() => {
          this.status = REJECTED;
          this.err = err;
          this.onRejectedCallbacks.forEach((fn) => fn());
        }, 0);
      }
    };

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled 如果不是函数，就忽略 onFulfilled
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // onRejected 如果不是函数，就忽略 onRejected
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
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
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0)
      }
      if (this.status === PENDING) {
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

  // 语法糖，只传 onRejected 的 then 方法
  catch(onRejected) {
    return this.then(null, onRejected)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 如果 x 是个 promise
  if (x instanceof MyPromise) {
    // 如果这个 promise 是 pending 状态，就在它的 then 方法里继续执行 resolvePromise 解析它的结果
    if (x.status === PENDING) {
      x.then(y => {
        resolvePromise(promise2, y, resolve, reject);
      }, err => {
        reject(err);
      });
    } else {
      x.then(resolve, reject);
    }
  } else {
    // 如果 x 是个值，就直接 resolve
    resolve(x);
  }
}

module.exports = MyPromise