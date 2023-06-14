import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
} from 'react-native';

import {
  Text,
  RadioButton,
  Button,
  Switch,
  TextInput,
} from 'react-native-paper';

import Slider from '@react-native-community/slider';

import ColorConvert from 'color-convert';

// eslint-disable-next-line no-unused-vars
function GenericVariable({ info, onChange }) {
  const {
    description,
    id,
    typecode,
    value,
  } = info;

  return (
    <View>
      <Text>Unknown variable type!</Text>
      <Text>{`Name: ${id}`}</Text>
      <Text>{`Value: ${value}`}</Text>
      <Text>{`Typecode: ${typecode}`}</Text>
      <Text>{`Description: ${description}`}</Text>
    </View>
  );
}

function BooleanVariable({ info, onChange }) {
  const {
    data: {
      tags,
    },
    value: stringValue,
  } = info;

  const value = (stringValue === 'True');

  const [off, on] = tags;

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>

        <Text>{off}</Text>
        <Switch
          value={value}
          onValueChange={() => {
            onChange((value) ? 'False' : 'True');
          }}
        />
        <Text>{on}</Text>

      </View>

    </View>
  );
}

function IntegerVariable({ info, onChange }) {
  const {
    data: {
      default_range: defaultRange,
      // allowed_range: allowedRange,
    },
    value,
  } = info;

  const [min, max] = defaultRange;

  return (
    <View>
      <Text>{`[${min}, ${max}]: ${value}`}</Text>

      <Slider
        value={parseInt(value, 10)}
        minimumValue={min}
        maximumValue={max}
        onSlidingComplete={(val) => {
          let updated = val;
          if (val < min) { updated = min; }
          if (val > max) { updated = max; }
          onChange(`${Math.round(updated)}`);
        }}
      />

    </View>
  );
}

function FloatingVariable({ info, onChange }) {
  const {
    data: {
      default_range: defaultRange,
      // allowed_range: allowedRange,
    },
    value,
  } = info;

  const [min, max] = defaultRange;

  return (
    <View>
      <Text>{`[${min}, ${max}]: ${value}`}</Text>

      <Slider
        value={parseFloat(value)}
        minimumValue={min}
        maximumValue={max}
        onSlidingComplete={(val) => {
          let updated = val;
          if (val < min) { updated = min; }
          if (val > max) { updated = max; }
          onChange(`${updated}`);
        }}
      />

    </View>
  );
}

function OptionVariable({ info, onChange }) {
  const {
    data: {
      options,
    },
    value,
  } = info;

  return (
    <View>

      {options.map((option) => (
        <React.Fragment key={option}>
          <View style={{ flexDirection: 'row' }}>
            <Text>{option}</Text>
            <RadioButton
              value={option}
              status={(value === option) ? 'checked' : 'unchecked'}
              onPress={() => onChange(option)}
            />
          </View>
        </React.Fragment>
      ))}

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
    default: defaultValue,
    description,
    id,
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
      <Text>{`Name: ${id}`}</Text>
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

function StringVariable({ info, onChange }) {
  const [text, setText] = useState('');
  const {
    id,
    value,
  } = info;

  // update text when value changes
  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <View>

      <TextInput
        label={id}
        value={text}
        onChangeText={(value) => { setText(value); }}
      />

      <Button
        onPress={() => {
          onChange(text);
          setText(text);
        }}
        // icon="backup-restore"
      >
        <Text>Submit</Text>
      </Button>

    </View>
  );
}

function getSpecializedVariable(typecode) {
  switch (typecode) {
    case 1: return BooleanVariable;
    case 2: return IntegerVariable;
    case 3: return FloatingVariable;
    case 4: return OptionVariable;
    case 5: return ColorPaletteVariable;
    case 6: return StringVariable;
    default: return GenericVariable;
  }
}

/**
 * Renders variable info from the target at path.
 * @param {
 *  info: the variable info to render
 * }
 * @returns
 */
export function Variable({ info, onChange }) {
  const {
    typecode,
    id,
    description,
    default: defaultValue,
  } = info;
  const SpecializedVariable = getSpecializedVariable(typecode);

  function handleChange(value) {
    onChange?.(value);
  }

  return (
    <>
      <Text variant="titleMedium">{id}</Text>
      <Text>{description}</Text>
      <SpecializedVariable info={info} onChange={(value) => { handleChange(value); }} />
      <Button
        onPress={() => handleChange(defaultValue)}
        icon="backup-restore"
      />
    </>
  );
}
