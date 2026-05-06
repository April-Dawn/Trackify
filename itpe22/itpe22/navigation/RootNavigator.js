import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../components/AuthProvider';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabs from './MainTabs';
import { styles, BLUE } from '../styles/GlobalStyles';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <View style={styles.desktopBg}>
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color={BLUE} />
          <Text style={styles.loadingText}>Trackify v2.0</Text>
        </View>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {state.userToken == null ? (
        <Stack.Group screenOptions={{ animationEnabled: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      ) : (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;