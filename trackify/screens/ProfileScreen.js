import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, RefreshControl, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import db from '../services/DatabaseService';
import { COLORS, globalStyles, SHADOWS } from '../styles/GlobalStyles';

const AVATARS = ['🎓', '⭐', '🏆', '📚', '💼', '🔬', '🎨', '📊', '🏅', '✨', '🎯', '📈'];

function confirmAction(title, message, onConfirm) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: onConfirm },
    ]);
  }
}

function showAlert(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '🎓');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    if (!user) return;
    setStats(await db.getUserStats(user.id));
    setName(user.name);
    setAvatar(user.avatar || '🎓');
  };

  useFocusEffect(useCallback(() => { load(); }, [user?.id]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const save = async () => {
    if (!name.trim()) { showAlert('Required', 'Name cannot be empty'); return; }
    await db.updateUser(user.id, { name: name.trim(), avatar });
    await refreshUser();
    setEditing(false);
    showAlert('Saved! ✅', 'Profile updated.');
  };

  const handleLogout = () => confirmAction('Sign Out', 'Are you sure you want to sign out?', logout);

  const level = Math.floor((user?.xp || 0) / 500) + 1;
  const xpInLevel = (user?.xp || 0) % 500;

  const achievements = [
    { emoji: '�', title: 'First Steps', desc: 'Enroll in first course', unlocked: (stats?.enrolledCourses || 0) >= 1 },
    { emoji: '✓', title: 'Bookworm', desc: 'Complete 10 lessons', unlocked: (stats?.totalLessons || 0) >= 10 },
    { emoji: '🏆', title: 'Graduate', desc: 'Complete a course', unlocked: (stats?.completedCourses || 0) >= 1 },
    { emoji: '⭐', title: 'On Fire', desc: '7-day streak', unlocked: (stats?.streak || 0) >= 7 },
    { emoji: '🏅', title: 'Diamond', desc: 'Reach 2000 XP', unlocked: (user?.xp || 0) >= 2000 },
    { emoji: '✨', title: 'Overachiever', desc: 'Enroll in 3+ courses', unlocked: (stats?.enrolledCourses || 0) >= 3 },
  ];

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Header */}
      <View style={[globalStyles.header, { justifyContent: 'space-between' }]}>
        <Text style={globalStyles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)} style={s.editBtn}>
          <Text style={s.editBtnText}>{editing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={s.profileCard}>
        {editing ? (
          <>
            <Text style={[globalStyles.sectionTitle, { alignSelf: 'flex-start', marginBottom: 12 }]}>Choose Avatar</Text>
            <View style={s.avatarGrid}>
              {AVATARS.map(a => (
                <TouchableOpacity
                  key={a}
                  onPress={() => setAvatar(a)}
                  style={[s.avatarOpt, avatar === a && { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary }]}
                >
                  <Text style={{ fontSize: 26 }}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[globalStyles.sectionTitle, { alignSelf: 'flex-start', marginTop: 16, marginBottom: 8 }]}>Display Name</Text>
            <TextInput
              style={[globalStyles.input, { width: '100%' }]}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="words"
            />
            <TouchableOpacity style={[globalStyles.btn, globalStyles.btnPrimary, { width: '100%' }]} onPress={save}>
              <Text style={globalStyles.btnText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={s.avatarCircle}>
              <Text style={{ fontSize: 42 }}>{user?.avatar || '🎓'}</Text>
            </View>
            <Text style={s.profileName}>{user?.name}</Text>
            <Text style={s.profileEmail}>{user?.email}</Text>

            {/* XP Progress */}
            <View style={s.xpSection}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={[globalStyles.body, { fontWeight: '800', color: COLORS.primary, letterSpacing: 0.2 }]}>Level {level}</Text>
                <Text style={[globalStyles.caption, { fontWeight: '700', color: COLORS.textMuted }]}>{xpInLevel} / 500 XP</Text>
              </View>
              <View style={s.xpBarBg}>
                <View style={[s.xpBarFill, { width: `${(xpInLevel / 500) * 100}%` }]} />
              </View>
              <Text style={[globalStyles.caption, { marginTop: 6, color: COLORS.textMuted }]}>{user?.xp || 0} XP total • {500 - xpInLevel} XP to next level</Text>
            </View>
          </>
        )}
      </View>

      {/* Stats */}
      {stats && !editing && (
        <>
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionTitle}>Stats</Text>
          </View>
          <View style={s.statsRow}>
            {[
              { v: stats.enrolledCourses, l: 'Courses', c: COLORS.primary },
              { v: stats.completedCourses, l: 'Completed', c: COLORS.secondary },
              { v: stats.totalLessons, l: 'Lessons', c: COLORS.accent },
              { v: stats.streak, l: 'Streak', c: COLORS.danger },
            ].map((item, idx) => (
              <View key={item.l} style={[s.statItem, idx === 3 && { borderRightWidth: 0 }]}>
                <Text style={[s.statVal, { color: item.c }]}>{item.v}</Text>
                <Text style={s.statLbl}>{item.l}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Achievements */}
      {!editing && (
        <>
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionTitle}>Achievements</Text>
          </View>
          <View style={s.achieveGrid}>
            {achievements.map(a => (
              <View key={a.title} style={[s.achieveCard, !a.unlocked && s.achieveCardLocked]}>
                <Text style={[{ fontSize: 28 }, !a.unlocked && { opacity: 0.25 }]}>{a.emoji}</Text>
                <Text style={[s.achieveTitle, !a.unlocked && { color: COLORS.textMuted }]}>{a.title}</Text>
                <Text style={s.achieveDesc}>{a.desc}</Text>
                {a.unlocked && (
                  <View style={s.unlockedBadge}>
                    <Text style={{ color: COLORS.secondary, fontSize: 9, fontWeight: '800' }}>✓ UNLOCKED</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <Text style={{ color: COLORS.danger, fontWeight: '700', fontSize: 15 }}>Sign Out</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  editBtn: {
    paddingHorizontal: 16, paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  profileCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  avatarCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS.primaryMid,
    marginBottom: 14,
  },
  profileName: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4, marginBottom: 4 },
  profileEmail: { fontSize: 13, color: COLORS.textMuted, marginBottom: 18 },

  xpSection: { width: '100%', marginTop: 4 },
  xpBarBg: { height: 8, borderRadius: 99, backgroundColor: COLORS.primaryLight, overflow: 'hidden' },
  xpBarFill: { height: '100%', borderRadius: 99, backgroundColor: COLORS.primary },

  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  avatarOpt: {
    width: 54, height: 54, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.backgroundAlt,
    borderWidth: 1.5, borderColor: 'transparent',
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1, alignItems: 'center',
    paddingVertical: 16,
    borderRightWidth: 1, borderRightColor: COLORS.border,
  },
  statVal: { fontSize: 20, fontWeight: '800' },
  statLbl: { fontSize: 11, color: COLORS.textMuted, marginTop: 3, fontWeight: '500' },

  achieveGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  achieveCard: {
    width: '30%', flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14, padding: 14, alignItems: 'center',
    ...SHADOWS.sm,
  },
  achieveCardLocked: { backgroundColor: COLORS.backgroundAlt },
  achieveTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center', marginTop: 8 },
  achieveDesc: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 3, lineHeight: 14 },
  unlockedBadge: {
    marginTop: 6, backgroundColor: COLORS.secondaryLight,
    borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3,
  },

  logoutBtn: {
    margin: 16, marginTop: 24,
    borderRadius: 14, padding: 15,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    borderWidth: 1, borderColor: '#FECACA',
  },
});