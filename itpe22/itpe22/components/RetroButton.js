import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from '../styles/GlobalStyles';

function RetroButton({ title, onPress, style, textStyle, disabled = false }) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.button, style, disabled && styles.buttonDisabled]}
      disabled={disabled}
    >
      <View style={styles.buttonFace}>
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default RetroButton;