import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './components/AuthProvider';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}