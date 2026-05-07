import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../styles/GlobalStyles';

function FormInput({ label, value, onChangeText, placeholder, secureTextEntry = false, error = null, editable = true }) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={[styles.input, error && styles.inputError, !editable && styles.inputDisabled]}
        placeholder={placeholder} 
        value={value} 
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export default FormInput;