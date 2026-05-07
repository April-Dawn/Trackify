import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import BevelBox from '../components/BevelBox';
import RetroButton from '../components/RetroButton';
import FormInput from '../components/FormInput';
import { styles, BLUE } from '../styles/GlobalStyles';

function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await signUp(name, email, password);
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.desktopBg}>
      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>Trackify - New Account</Text>
        <View style={styles.titleBarButtons}>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>_</Text></View>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>X</Text></View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.registerContent}>
        <BevelBox style={styles.loginWindow}>
          <Text style={styles.windowTitle}>Create New Account</Text>
          
          <FormInput 
            label="Full Name:" 
            value={name} 
            onChangeText={setName}
            placeholder="Enter your name"
            error={errors.name}
            editable={!loading}
          />
          
          <FormInput 
            label="Email:" 
            value={email} 
            onChangeText={setEmail}
            placeholder="Enter email"
            error={errors.email}
            editable={!loading}
          />
          
          <FormInput 
            label="Password:" 
            value={password} 
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            error={errors.password}
            editable={!loading}
          />
          
          <FormInput 
            label="Confirm Password:" 
            value={confirmPassword} 
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
            error={errors.confirmPassword}
            editable={!loading}
          />

          <View style={styles.buttonRow}>
            <RetroButton 
              title={loading ? "Creating..." : "Create Account"} 
              onPress={handleRegister}
              disabled={loading}
            />
            <RetroButton 
              title="Cancel" 
              onPress={() => navigation.goBack()}
              disabled={loading}
            />
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={BLUE} />
              <Text style={styles.loadingText}>Creating account...</Text>
            </View>
          )}
        </BevelBox>
        <Text style={styles.footer}>Trackify v2.0 | © 1998-2025</Text>
      </ScrollView>
    </View>
  );
}

export default RegisterScreen;