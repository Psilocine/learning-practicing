class Emitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (event) {
      for (let i = 0; i < this.events[event].length; i++) {
        const cb = this.events[event][i];
        if (cb === callback) {
          this.events[event].splice(i, 1);
          break;
        }
      }
    }
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((cb) => cb(args));
    }
  }

  once(event, callback) {
    const cb = (...args) => {
      callback(args);

      this.off(event, callback);
    };

    this.on(event, cb);
  }

  removeAll(event) {
    if (event) {
      this.events[event] = null;
    } else {
      this.events = Object.create(null);
    }
  }
}
