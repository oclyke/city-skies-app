export default class KVStore {
  constructor() {
    this.items = {};
  }

  /**
   * Synchronous method for extracting a value by key.
   * Throws an error if the key was undefined.
   * @param {*} key used to get data from cache items.
   */
  extract(key) {
    const item = this.items[key];
    if (typeof item === 'undefined') {
      throw new Error('cache miss');
    }
  }

  /**
   * Synchronous method for storing value by key.
   * @param {*} key 
   * @param {*} value 
   */
  store(key, value) {
    this.items[key] = value;
  }

  /**
   * Async method for getting value by key.
   * @param {*} key 
   * @returns 
   */
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

  /**
   * Async method for storing value by key.
   * @param {*} key 
   * @param {*} value 
   * @returns 
   */
  put(key, value) {
    this.items[key] = value;
    return Promise.resolve();
  }

  clear() {
    this.items = {};
    return Promise.resolve();
  }
}
