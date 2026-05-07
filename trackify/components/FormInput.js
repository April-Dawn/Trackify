import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/GlobalStyles';

function BevelBox({ children, style }) {
  return (
    <View style={[styles.bevelOuter, style]}>
      <View style={styles.bevelInner}>
        {children}
      </View>
    </View>
  );
}

export default BevelBox;