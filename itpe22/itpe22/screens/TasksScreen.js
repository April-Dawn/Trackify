import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import BevelBox from '../components/BevelBox';
import { styles, RED } from '../styles/GlobalStyles';

function TasksScreen() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Complete project', priority: 'High', category: 'Work', completed: false },
    { id: '2', title: 'Buy groceries', priority: 'Medium', category: 'Personal', completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getPriorityColor = (p) => 
    p === 'High' ? RED : p === 'Medium' ? '#ffaa00' : GREEN;

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <View style={styles.desktopBg}>
      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>Trackify - Tasks</Text>
        <View style={styles.titleBarButtons}>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>_</Text></View>
          <View style={styles.titleBarBtn}><Text style={styles.titleBarBtnText}>X</Text></View>
        </View>
      </View>
      <View style={styles.menuBar}>
        <Text style={styles.menuItem}>File</Text>
        <Text style={styles.menuItem}>Task</Text>
        <Text style={styles.menuItem}>Help</Text>
      </View>
      
      {tasks.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateIcon}>📋</Text>
          <Text style={styles.emptyStateTitle}>No Tasks Available</Text>
          <Text style={styles.emptyStateText}>You have completed all tasks or haven't added any yet.</Text>
        </View>
      ) : (
        <FlatList 
          data={tasks} 
          keyExtractor={(item) => item.id} 
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <BevelBox style={styles.taskItem}>
              <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.taskRow}>
                <Text style={styles.checkbox}>{item.completed ? '[X]' : '[ ]'}</Text>
                <View style={styles.taskDetails}>
                  <Text style={[styles.taskTitle, item.completed && styles.taskDone]}>
                    {item.title}
                  </Text>
                  <Text style={styles.taskMeta}>
                    {item.category} | Priority: <Text style={{color: getPriorityColor(item.priority)}}>
                      {item.priority}
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
            </BevelBox>
          )} 
        />
      )}
      
      <View style={styles.statusBar}>
        <Text style={styles.statusBarText}>{completedCount}/{tasks.length} completed</Text>
        <Text style={styles.statusBarText}>Ready</Text>
      </View>
    </View>
  );
}

export default TasksScreen;