import React from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    height: 40,
  },
});

export default function Layer({ path }) {



  return (
    <View style={styles.container}>
      <Text>{path}</Text>
    </View>
  );
}
