
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import RemindersScreen from '../screens/RemindersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { styles, BLUE, DARK_GRAY } from '../styles/GlobalStyles';

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
      tabBarIconStyle: styles.tabIcon,
      headerShown: false,
      tabBarActiveTintColor: BLUE,
      tabBarInactiveTintColor: DARK_GRAY,
    }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home', tabBarIcon: () => <Text style={styles.tabIcon}>🏠</Text> }} 
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen} 
        options={{ tabBarLabel: 'Tasks', tabBarIcon: () => <Text style={styles.tabIcon}>☑️</Text> }} 
      />
      <Tab.Screen 
        name="Reminders" 
        component={RemindersScreen} 
        options={{ tabBarLabel: 'Reminders', tabBarIcon: () => <Text style={styles.tabIcon}>⏰</Text> }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile', tabBarIcon: () => <Text style={styles.tabIcon}>👤</Text> }} 
      />
    </Tab.Navigator>
  );
}

export default MainTabs;