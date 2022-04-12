/**
 * 目标：
 * 1. 实现 Promise 链式操作
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

    let resolve = value => {
      // 如果当前状态是 pending，才去执行逻辑并改变状态为 fulfilled
      if (this.status === PENDING) {
        setTimeout(() => {
          this.status = FULFILLED
          this.value = value;
          this.onFulfilledCallbacks.forEach(fn => fn());
        }, 0);
      }
    }

    let reject = err => {
      // 如果当前状态是 pending，才去执行逻辑并改变状态为 rejected
      if (this.status === PENDING) {
        setTimeout(() => {
          this.status = REJECTED;
          this.err = err;
          this.onRejectedCallbacks.forEach((fn) => fn());
        }, 0);
      }
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled)
      this.onRejectedCallbacks.push(onRejected)
      // this.onFulfilled = onFulfilled
      // this.onRejected = onRejected
    } else if (this.status === FULFILLED) {
      // 如果状态是 fulfilled，立即执行 onFulfilled 回调
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      // 如果状态是 rejected，立即执行 onRejected 回调
      onRejected(this.err)
    }

    // 和 jQuery 原理一致，每次调用完返回自身实例
    return this;
  }
}

module.exports = MyPromise