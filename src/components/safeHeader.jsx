import React from 'react';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export function withSafeHeaderStyles(Component) {
  return function inner(props) {
    const insets = useSafeAreaInsets();
    let style;
    if (typeof props.style !== 'undefined') {
      style = {
        ...props.style,
        height: insets.top,
      };
    } else {
      style = {
        height: insets.top,
      };
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} style={style} />;
  };
}
