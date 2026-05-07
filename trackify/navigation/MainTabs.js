import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../styles/GlobalStyles';
import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ProgressScreen from '../screens/ProgressScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home',    emoji: '🏠', label: 'Home' },
  { name: 'Courses', emoji: '📚', label: 'Courses' },
  { name: 'Progress',emoji: '📊', label: 'Progress' },
  { name: 'Leaders', emoji: '🏆', label: 'Ranks' },
  { name: 'Profile', emoji: '👤', label: 'Profile' },
];

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Text style={[styles.tabEmoji, { opacity: focused ? 1 : 0.45 }]}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
        },
      }}
    >
      {TABS.map(({ name, emoji, label }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={
            name === 'Home' ? HomeScreen :
            name === 'Courses' ? CoursesScreen :
            name === 'Progress' ? ProgressScreen :
            name === 'Leaders' ? LeaderboardScreen :
            ProfileScreen
          }
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji={emoji} label={label} focused={focused} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center', paddingTop: 2 },
  tabItemActive: {},
  tabEmoji: { fontSize: 20, marginBottom: 3 },
  tabLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '500' },
  tabLabelActive: { color: COLORS.primary, fontWeight: '700' },
});