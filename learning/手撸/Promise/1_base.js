/**
 * 目标：
 * 1. 可以创建 Promise 对象实例
 * 2. Promise 实例传入的异步方法执行成功就执行成功回调，失败就执行失败回调
 */

class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.err = undefined
    this.onFulfilled = null;
    this.onRejected = null;

    let resolve = value => {
      this.value = value;
      this.onFulfilled(this.value)
    }

    let reject = err => {
      this.err = err;
      this.onRejected(this.err)
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  }
}

module.exports = MyPromise