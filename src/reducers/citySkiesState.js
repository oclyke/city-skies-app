/*
city skies state

represents the overall state of the running firmware

state: {
  info: {
    hw_version: 'semver',
    api_version: 'senver',
  },
  shards: [
    'shardName1',
    ...
    'shardNameN',
  ],
  global_variables: {
    variable_name1: {

    }
  }
}

*/

export default function citySkiesStateReducer(state, action) {
  switch (action.type) {
    case 'add-layer': {
      return state;
    }
    default: {
      return state;
    }
  }
}
