import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import BevelBox from '../components/BevelBox';
import { styles } from '../styles/GlobalStyles';

function RemindersScreen() {
  const [reminders, setReminders] = useState([
    { id: '1', title: 'Project deadline', date: '1998-12-20', enabled: true },
    { id: '2', title: 'Team meeting', date: '1998-12-18', enabled: true },
  ]);

  const toggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <View style={styles.desktopBg}>
      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>Trackify - Reminders</Text>
        <View style={styles.titleBarButtons}>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>_</Text></View>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>X</Text></View>
        </View>
      </View>
      <View style={styles.menuBar}>
        <Text style={styles.menuItem}>File</Text>
        <Text style={styles.menuItem}>Edit</Text>
        <Text style={styles.menuItem}>Help</Text>
      </View>
      
      {reminders.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No Reminders</Text>
          <Text style={styles.emptyStateText}>You haven't set any reminders yet.</Text>
        </View>
      ) : (
        <FlatList 
          data={reminders} 
          keyExtractor={(item) => item.id} 
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <BevelBox style={styles.reminderItem}>
              <View style={styles.reminderRow}>
                <View style={{flex: 1}}>
                  <Text style={styles.reminderTitle}>{item.title}</Text>
                  <Text style={styles.reminderDate}>Due: {item.date}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => toggleReminder(item.id)}
                  style={[styles.switchContainer, !item.enabled && styles.switchOff]}
                >
                  <Text style={styles.switchLabel}>{item.enabled ? 'ON' : 'OFF'}</Text>
                </TouchableOpacity>
              </View>
            </BevelBox>
          )} 
        />
      )}
      
      <View style={styles.statusBar}>
        <Text style={styles.statusBarText}>{reminders.filter(r => r.enabled).length} active</Text>
        <Text style={styles.statusBarText}>Ready</Text>
      </View>
    </View>
  );
}

export default RemindersScreen;