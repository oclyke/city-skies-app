import Instance from './instance';
import Stack from './stack';
import StackManager from './stackManager';
import Layer from './layer';
import Variable from './variable';
import VariableManager from './variableManager';

export {
  Instance,
  Stack,
  StackManager,
  Layer,
  Variable,
  VariableManager,
};

const initialInstance = {
  stacks: {
    count: 2,
    ids: ['active', 'inactive'],
  },
};

const initialStackManager = {
  active: 'a',
  stacks: {
    count: 0,
    ids: [],
  },
};

const initialStack = {
  id: '',
  layer: {
    count: 0,
    ids: [],
  },
};

const initialLayer = {
  id: 0,
  index: 0,
  shard: '',
  active: false,
  useLocalPalette: false,
  variables: {
    count: 0,
    ids: [],
  },
  privateVariables: {
    count: 0,
    ids: [],
  },
};

const initialVariable = {
  id: '',
  typecode: 0,
  description: '',
  default: '',
  value: '',
  data: {},
};

export {
  initialInstance,
  initialStackManager,
  initialStack,
  initialLayer,
  initialVariable,
};

async function getShardNames(address) {
  const response = await fetch(`http://${address}/shards`, { method: 'GET' });
  const text = await response.text();
  const { edges } = JSON.parse(text);
  return edges.map((edge) => edge.cursor);
}

// async function getLayer(address, stack, id) {
//   const response = await fetch(`http://${address}/stacks/${stack}/layers/${id}`, { method: 'GET' });
//   console.log()
// }

async function getVariable(address, uri) {
  const info = await fetch(`http://${address}${uri}/info`, { method: 'GET' })
    .then((response) => response.text())
    .then(JSON.parse)
    .catch(console.error);

  return info;
}

async function getLayer(address, stackName, layerName) {
  const info = await fetch(`http://${address}/stacks/${stackName}/layers/${layerName}/info`, { method: 'GET' })
    .then((response) => response.text())
    .then(JSON.parse)
    .catch(console.error)

  const variableNames = await fetch(`http://${address}/stacks/${stackName}/layers/${layerName}/variables`, { method: 'GET' })
    .then((response) => response.text())
    .then(JSON.parse)
    .catch(console.error);

  const privateVariableNames = await fetch(`http://${address}/stacks/${stackName}/layers/${layerName}/private_variables`, { method: 'GET' })
    .then((response) => response.text())
    .then(JSON.parse)
    .catch(console.error);

  const variables = await Promise.all(variableNames.map(
    (variableName) => getVariable(address, `/stacks/${stackName}/layers/${layerName}/variables/${variableName}`),
  ));

  const privateVariables = await Promise.all(privateVariableNames.map(
    (variableName) => getVariable(address, `/stacks/${stackName}/layers/${layerName}/private_variables/${variableName}`),
  ));

  const layer = {
    info,
    variables,
    privateVariables,
  };

  return layer;
}

async function getStack(address, stackName) {
  const layerNames = await fetch(`http://${address}/stacks/${stackName}/layers`, { method: 'GET' })
    .then((response) => response.text())
    .then(JSON.parse);
    // .then();

  const layers = await Promise.all(layerNames.map(
    (layerName) => getLayer(address, stackName, layerName),
  ));

  const stack = {
    layers,
  };

  return stack;
}

async function getFullState(address) {
  // await fetch();

  const shards = await getShardNames(address);
  const stacks = {
    active: await getStack(address, 'active'),
    inactive: await getStack(address, 'inactive'),
  };

  const state = {
    address,
    shards,
    stacks,
  };

  return state;
}
