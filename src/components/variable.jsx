import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import {
  Slider,
} from '@react-native-community/slider';

import ColorConvert from 'color-convert';

export default function Variable({ variable }) {
  switch (variable.type) {
    // floating point variable
    case 3: {
      // const { allowedRange } = variable.info;
      const { defaultRange } = variable.info;
      const { value } = variable.info;

      return (
        <View>
          <Text>
            Name:
            {variable.name}
          </Text>
          <Slider
            value={Number(value)}
            minimumValue={Number(defaultRange[0])}
            maximumValue={Number(defaultRange[1])}
            onSlidingComplete={async (v) => {
              console.log('sliding complete: ', { v });
            }}
          />
        </View>
      );
    }

    // color palette variables
    case 5: {
      const value = JSON.parse(variable.info.value);
      const colorsStrings = value.colors
        .map((color) => [
          // eslint-disable-next-line no-bitwise
          (color & 0xff0000) >> 16,
          // eslint-disable-next-line no-bitwise
          (color & 0x00ff00) >> 8,
          // eslint-disable-next-line no-bitwise
          (color & 0x0000ff) >> 0,
        ])
        .map((rgb) => `#${ColorConvert.rgb.hex(rgb)}`);

      return (
        <View>
          <Text>
            Name:
            {variable.name}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {colorsStrings.map((color) => (
              <React.Fragment key={`variable.${variable.name}.colors.${color}`}>
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

    default: {
      return (
        <View>
          <Text>
            Name:
            {variable.name}
          </Text>
          <Text>
            Unknown Variable Type:
            {variable.type}
          </Text>
        </View>
      );
    }
  }
}
