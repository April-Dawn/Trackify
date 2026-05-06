import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import BevelBox from '../components/BevelBox';
import { styles, BLUE } from '../styles/GlobalStyles';

function ProfileScreen({ navigation }) {
  const { state, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? Your session will be cleared.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            setLoading(true);
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
              setLoading(false);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const currentUser = state.user;

  return (
    <View style={styles.desktopBg}>
      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>Trackify - Profile</Text>
        <View style={styles.titleBarButtons}>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>_</Text></View>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>X</Text></View>
        </View>
      </View>
      <View style={styles.menuBar}>
        <Text style={styles.menuItem}>File</Text>
        <Text style={styles.menuItem}>Options</Text>
        <Text style={styles.menuItem}>Help</Text>
      </View>
      <ScrollView contentContainerStyle={styles.profileContent}>
        <BevelBox style={styles.profileBox}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.profileName}>{currentUser?.name || 'Unknown User'}</Text>
          <Text style={styles.profileEmail}>{currentUser?.email || 'No email'}</Text>
        </BevelBox>

        <BevelBox style={styles.optionsBox}>
          <TouchableOpacity style={styles.optionBtn}>
            <Text style={styles.optionText}>📋 Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <Text style={styles.optionText}>🔒 Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <Text style={styles.optionText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </BevelBox>

        <BevelBox style={styles.versionBox}>
          <Text style={styles.versionTitle}>App Information</Text>
          <Text style={styles.versionItem}>Version: 2.0</Text>
          <Text style={styles.versionItem}>Features: Persistent Login, Global State</Text>
          <Text style={styles.versionItem}>Status: Enhanced Edition</Text>
        </BevelBox>

        <BevelBox style={styles.optionsBox}>
          <TouchableOpacity 
            style={[styles.optionBtn, styles.logoutBtn]} 
            onPress={handleLogout}
            disabled={loading}
          >
            <Text style={[styles.optionText, styles.logoutText]}>
              {loading ? '🔄 Logging out...' : '🚪 Logout'}
            </Text>
          </TouchableOpacity>
        </BevelBox>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={BLUE} />
            <Text style={styles.loadingText}>Logging out...</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.statusBar}>
        <Text style={styles.statusBarText}>Profile loaded</Text>
        <Text style={styles.statusBarText}>Ready</Text>
      </View>
    </View>
  );
}

export default ProfileScreen;