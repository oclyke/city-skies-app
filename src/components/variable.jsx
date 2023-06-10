import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import {
  useInstanceData,
} from 'src/hooks/citySkies';

import ColorConvert from 'color-convert';

function GenericVariable({ info }) {
  const {
    description,
    name,
    typecode,
    value,
  } = info;

  return (
    <View>
      <Text>Unknown variable type!</Text>
      <Text>{`Name: ${name}`}</Text>
      <Text>{`Value: ${value}`}</Text>
      <Text>{`Typecode: ${typecode}`}</Text>
      <Text>{`Description: ${description}`}</Text>
    </View>
  );
}

function BooleanVariable({ info }) {
  const {
    data: {
      tags,
    },
    ['default']: defaultValue,
    description,
    name,
    typecode,
    value,
  } = info;

  return (
    <View>
      <Text>Boolean Variable:</Text>
      <Text>{`Name: ${name}`}</Text>
      <Text>{`Value: ${value}`}</Text>
      <Text>{`Default: ${defaultValue}`}</Text>
      <Text>{`Typecode: ${typecode}`}</Text>
      <Text>{`Tags: ${tags}`}</Text>
      <Text>{`Description: ${description}`}</Text>
    </View>
  );
}

function IntegerVariable({ info }) {
  const {
    data: {
      default_range: defaultRange,
      allowed_range: allowedRange,
    },
    ['default']: defaultValue,
    description,
    name,
    typecode,
    value,
  } = info;

  return (
    <View>
      <Text>Integer Variable:</Text>
      <Text>{`Name: ${name}`}</Text>
      <Text>{`Value: ${value}`}</Text>
      <Text>{`Default: ${defaultValue}`}</Text>
      <Text>{`Typecode: ${typecode}`}</Text>
      <Text>{`Allowed Range: ${allowedRange}`}</Text>
      <Text>{`Default Range: ${defaultRange}`}</Text>
      <Text>{`Description: ${description}`}</Text>
    </View>
  );
}

function FloatingVariable({ info }) {
  const {
    data: {
      default_range: defaultRange,
      allowed_range: allowedRange,
    },
    ['default']: defaultValue,
    description,
    name,
    typecode,
    value,
  } = info;

  return (
    <View>
      <Text>Floating Variable:</Text>
      <Text>{`Name: ${name}`}</Text>
      <Text>{`Value: ${value}`}</Text>
      <Text>{`Default: ${defaultValue}`}</Text>
      <Text>{`Typecode: ${typecode}`}</Text>
      <Text>{`Allowed Range: ${allowedRange}`}</Text>
      <Text>{`Default Range: ${defaultRange}`}</Text>
      <Text>{`Description: ${description}`}</Text>
    </View>
  );
}

function OptionVariable({ info }) {
  const {
    data: {
      default_range: defaultRange,
      allowed_range: allowedRange,
    },
    ['default']: defaultValue,
    description,
    name,
    typecode,
    value,
  } = info;

  return (
    <View>
      <Text>Floating Variable:</Text>
      <Text>{`Name: ${name}`}</Text>
      <Text>{`Value: ${value}`}</Text>
      <Text>{`Default: ${defaultValue}`}</Text>
      <Text>{`Typecode: ${typecode}`}</Text>
      <Text>{`Allowed Range: ${allowedRange}`}</Text>
      <Text>{`Default Range: ${defaultRange}`}</Text>
      <Text>{`Description: ${description}`}</Text>
    </View>
  );
}

function getColorStrings(colors) {
  return colors.map((color) => [
    // eslint-disable-next-line no-bitwise
    (color & 0xff0000) >> 16,
    // eslint-disable-next-line no-bitwise
    (color & 0x00ff00) >> 8,
    // eslint-disable-next-line no-bitwise
    (color & 0x0000ff) >> 0,
  ]).map((rgb) => `#${ColorConvert.rgb.hex(rgb)}`);
}

function ColorPaletteVariable({ info }) {
  const {
    data: {
      default_range: defaultRange,
      allowed_range: allowedRange,
    },
    ['default']: defaultValue,
    description,
    name,
    typecode,
    value,
  } = info;

  // convert string value into JSON
  const {
    colors,
    map_type: mapType,
  } = JSON.parse(value);

  // convert colors to hex strings
  const colorsStrings = getColorStrings(colors);

  return (
    <View>
      <Text>Color Palette Variable:</Text>
      <Text>{`Name: ${name}`}</Text>
      <Text>{`Value: ${{ colors, mapType }}`}</Text>
      <Text>{`Default: ${defaultValue}`}</Text>
      <Text>{`Typecode: ${typecode}`}</Text>
      <Text>{`Allowed Range: ${allowedRange}`}</Text>
      <Text>{`Default Range: ${defaultRange}`}</Text>
      <Text>{`Description: ${description}`}</Text>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        {colorsStrings.map((color, idx) => (
          <React.Fragment key={idx}>
            <View
              style={{
                backgroundColor: color,
                width: `${100 / colorsStrings.length}%`,
                height: 20,
              }}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

function StringVariable({ info }) {
  const {
    ['default']: defaultValue,
    description,
    name,
    typecode,
    value,
  } = info;

  return (
    <View>
      <Text>Floating Variable:</Text>
      <Text>{`Name: ${name}`}</Text>
      <Text>{`Value: ${value}`}</Text>
      <Text>{`Default: ${defaultValue}`}</Text>
      <Text>{`Typecode: ${typecode}`}</Text>
      <Text>{`Description: ${description}`}</Text>
    </View>
  );
}

/**
 * Renders variable info from the target at path.
 * @param {
 *  path: the path at which the variable is published on the target
 * }
 * @returns
 */
export default function Variable({ path }) {
  const [info, loading] = useInstanceData(path);

  // show loading state
  if (loading === true) {
    return (
      <View>
        <Text>Loading</Text>
        <Text>{path}</Text>
      </View>
    );
  }

  // check the typecode
  const { typecode } = info;

  switch (typecode) {
    case 1: return <BooleanVariable info={info} />;
    case 2: return <IntegerVariable info={info} />;
    case 3: return <FloatingVariable info={info} />;
    case 4: return <OptionVariable info={info} />;
    case 5: return <ColorPaletteVariable info={info} />;
    case 6: return <StringVariable info={info} />;
    default: return <GenericVariable info={info} />;
  }
}
