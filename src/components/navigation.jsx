import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Link,
} from 'react-router-native';

import {
  useInstanceConnection,
} from 'src/hooks/citySkies';

const navUnderlayColor = '#f0f4f7';

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  subNavItem: {
    padding: 5,
  },
  circle: {
    height: 10,
    width: 10,
    borderRadius: '50%',
  },
});

export default function Navigation() {
  const {
    connected,
  } = useInstanceConnection();

  return (
    <View style={styles.nav}>
      <Link
        to="/stacks"
        underlayColor={navUnderlayColor}
        style={styles.navItem}
      >
        <Text>Stacks</Text>
      </Link>
      <Link
        to="/shards"
        underlayColor={navUnderlayColor}
        style={styles.navItem}
      >
        <Text>Shards</Text>
      </Link>
      <Link
        to="/connection"
        underlayColor={navUnderlayColor}
        style={styles.navItem}
      >
        <View>
          <Text>Connection</Text>
          <View
            style={{
              ...styles.circle,
              backgroundColor: (connected) ? 'green' : 'red',
            }}
          />
        </View>
      </Link>
    </View>
  );
}
