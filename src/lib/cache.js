export default class KVStore {
  constructor() {
    this.items = {};
  }

  get(key) {
    return new Promise((resolve, reject) => {
      const item = this.items[key];
      if (typeof item === 'undefined') {
        reject(new Error('cache miss'));
      } else {
        resolve(item);
      }
    });
  }

  store(key, value) {
    this.items[key] = value;
    return Promise.resolve();
  }

  clear() {
    this.items = {};
    return Promise.resolve();
  }
}
