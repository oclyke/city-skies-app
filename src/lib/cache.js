export default class KVStore {
  constructor() {
    this.items = {};
  }

  get(key) {
    return this.items[key];
  }

  store(key, value) {
    this.items[key] = value;
  }

  clear() {
    this.items = {};
  }
}
