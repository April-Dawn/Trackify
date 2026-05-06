import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import BevelBox from '../components/BevelBox';
import RetroButton from '../components/RetroButton';
import FormInput from '../components/FormInput';
import { styles, BLUE } from '../styles/GlobalStyles';

function LoginScreen({ navigation }) {
  const { signIn, state } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error.message + '\n\nDemo: test@trackify.com / test123456');
      setLoading(false);
    }
  };

  return (
    <View style={styles.desktopBg}>
      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>Welcome to Trackify v2.0</Text>
        <View style={styles.titleBarButtons}>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>_</Text></View>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>X</Text></View>
        </View>
      </View>
      <View style={styles.loginContent}>
        <BevelBox style={styles.loginWindow}>
          <Text style={styles.windowTitle}>Login Required</Text>
          
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

          <View style={styles.buttonRow}>
            <RetroButton 
              title={loading ? "Logging in..." : "OK"} 
              onPress={handleLogin}
              disabled={loading}
            />
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={BLUE} />
              <Text style={styles.loadingText}>Authenticating...</Text>
            </View>
          )}

          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')} 
            style={styles.registerLink}
            disabled={loading}
          >
            <Text style={styles.registerText}>Create New Account</Text>
          </TouchableOpacity>
          
          <Text style={styles.hint}>Demo: test@trackify.com / test123456</Text>
        </BevelBox>
        <Text style={styles.footer}>Trackify v2.0 | Enhanced Edition | © 1998-2025</Text>
      </View>
    </View>
  );
}

export default LoginScreen;