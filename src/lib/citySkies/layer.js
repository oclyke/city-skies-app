export default class Layer {
  constructor() {
    this.id = 0;
    this.index = 0;
    this.shard = '';
    this.active = false;
    this.useLocalPalette = false;
    this.variables = {
      count: 0,
      ids: [],
    };
    this.privateVariables = {
      count: 0,
      ids: [],
    };
  }
}
