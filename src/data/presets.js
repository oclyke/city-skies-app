const HomeOnTheRange = {
  name: 'home on the range',
  layers: [
    {
      config: {
        shard_uuid: 'noise',
        use_local_palette: true,
      },
      variables: {
        speed: '0.0001',
        scaleX: '0.04',
        scaleY: '0.04',
      },
      standardVariables: {
        palette: '{"colors": [16090390, 11679195], "map_type": "discrete_circular"}',
      },
    },
    {
      config: {
        shard_uuid: 'diamond',
        use_local_palette: true,
        active: false,
      },
      variables: {
        speed: '0.0001',
        scale: '0.2',
      },
      standardVariables: {
        composition_mode: 'alpha_copy',
      },
    },
  ],
};

export const defaultPresets = [
  HomeOnTheRange,
];
