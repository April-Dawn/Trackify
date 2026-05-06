import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import BevelBox from '../components/BevelBox';
import { styles } from '../styles/GlobalStyles';

function HomeScreen() {
  const { state } = useAuth();
  const [stats] = useState({
    pending: 2,
    completed: 1,
    total: 3,
  });

  return (
    <View style={styles.desktopBg}>
      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>Trackify - Home</Text>
        <View style={styles.titleBarButtons}>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>_</Text></View>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>X</Text></View>
        </View>
      </View>
      <View style={styles.menuBar}>
        <Text style={styles.menuItem}>File</Text>
        <Text style={styles.menuItem}>View</Text>
        <Text style={styles.menuItem}>Help</Text>
      </View>
      <ScrollView contentContainerStyle={styles.homeContent}>
        <BevelBox style={styles.statusBox}>
          <Text style={styles.statusTitle}>System Status</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats.pending}</Text>
              <Text style={styles.statDesc}>Pending</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats.completed}</Text>
              <Text style={styles.statDesc}>Done</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats.total}</Text>
              <Text style={styles.statDesc}>Total</Text>
            </View>
          </View>
        </BevelBox>
        
        <BevelBox style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>Welcome to Trackify v2.0!</Text>
          <Text style={styles.subText}>Enhanced tracking with persistent storage and real-time updates</Text>
        </BevelBox>

        <BevelBox style={styles.featureBox}>
          <Text style={styles.featureTitle}>✨ What's New in v2.0</Text>
          <Text style={styles.featureItem}>• Auto-login with persistent sessions</Text>
          <Text style={styles.featureItem}>• Real-time form validation</Text>
          <Text style={styles.featureItem}>• Loading indicators for async actions</Text>
          <Text style={styles.featureItem}>• Global state management</Text>
          <Text style={styles.featureItem}>• Better error handling</Text>
        </BevelBox>
      </ScrollView>
      <View style={styles.statusBar}>
        <Text style={styles.statusBarText}>User: {state.user?.name || 'Guest'}</Text>
        <Text style={styles.statusBarText}>Ready</Text>
      </View>
    </View>
  );
}

export default HomeScreen;