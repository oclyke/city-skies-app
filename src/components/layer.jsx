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

export default function Layer({ uri }) {
  return (
    <View style={styles.container}>
      <Text>{uri}</Text>
    </View>
  );
}
