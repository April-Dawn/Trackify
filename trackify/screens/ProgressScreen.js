import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import db from '../services/DatabaseService';
import { COLORS, globalStyles, SHADOWS } from '../styles/GlobalStyles';

export default function ProgressScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courseProgress, setCourseProgress] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    if (!user) return;
    const [s, courses, progressList] = await Promise.all([
      db.getUserStats(user.id),
      db.getEnrolledCourses(user.id),
      db.getProgress(user.id, null),
    ]);
    setStats(s);
    setCourseProgress(
      courses
        .map(c => ({ course: c, progress: progressList.find(p => p.courseId === c.id) || { lessonsCompleted: 0, xpEarned: 0 } }))
        .sort((a, b) => (b.progress.lessonsCompleted / b.course.totalLessons) - (a.progress.lessonsCompleted / a.course.totalLessons))
    );
  };

  useFocusEffect(useCallback(() => { load(); }, [user?.id]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const level = Math.floor((user?.xp || 0) / 500) + 1;
  const xpInLevel = (user?.xp || 0) % 500;

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>My Progress</Text>
      </View>

      {/* Summary Card */}
      {stats && (
        <View style={s.summaryCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={s.avatarBox}>
              <Text style={{ fontSize: 30 }}>{user?.avatar || '🎓'}</Text>
            </View>
            <View style={{ marginLeft: 14 }}>
              <Text style={globalStyles.h2}>{user?.name}</Text>
              <Text style={[globalStyles.caption, { marginTop: 2 }]}>Level {level} · {user?.xp || 0} XP total</Text>
            </View>
          </View>

          {/* XP Bar */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={[globalStyles.body, { fontWeight: '700', color: COLORS.primary }]}>Level {level}</Text>
            <Text style={globalStyles.caption}>{xpInLevel} / 500 XP</Text>
          </View>
          <View style={s.xpBarBg}>
            <View style={[s.xpBarFill, { width: `${(xpInLevel / 500) * 100}%` }]} />
          </View>
          <Text style={[globalStyles.caption, { marginTop: 6 }]}>{500 - xpInLevel} XP to Level {level + 1}</Text>

          {/* Stats Row */}
          <View style={s.statsRow}>
            {[
              { v: stats.enrolledCourses, l: 'Enrolled', c: COLORS.primary },
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
        </View>
      )}

      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Course Breakdown</Text>
      </View>

      {courseProgress.length === 0 ? (
        <View style={globalStyles.emptyState}>
          <Text style={[globalStyles.h3, { marginBottom: 8 }]}>No progress yet</Text>
          <Text style={[globalStyles.body, { textAlign: 'center' }]}>Enroll in courses to start tracking!</Text>
        </View>
      ) : courseProgress.map(({ course, progress }) => {
        const pct = Math.round((progress.lessonsCompleted / course.totalLessons) * 100);
        const done = progress.lessonsCompleted >= course.totalLessons;

        return (
          <View key={course.id} style={[s.card, done && { borderWidth: 1.5, borderColor: COLORS.secondary + '50' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              <View style={[s.emojiBox, { backgroundColor: course.color + '18' }]}>
                <Text style={{ fontSize: 26 }}>{course.emoji}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={globalStyles.h3} numberOfLines={1}>{course.title}</Text>
                <Text style={globalStyles.caption}>{course.subject}</Text>
              </View>
              {done && (
                <View style={[globalStyles.badge, { backgroundColor: COLORS.secondaryLight }]}>
                  <Text style={{ color: COLORS.secondary, fontSize: 11, fontWeight: '800' }}>✓ DONE</Text>
                </View>
              )}
            </View>

            {/* Progress bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={globalStyles.caption}>Lessons</Text>
              <Text style={[globalStyles.caption, { fontWeight: '700', color: done ? COLORS.secondary : course.color }]}>{pct}%</Text>
            </View>
            <View style={globalStyles.progressBar}>
              <View style={[globalStyles.progressFill, { width: `${pct}%`, backgroundColor: done ? COLORS.secondary : course.color }]} />
            </View>
            <Text style={[globalStyles.caption, { marginTop: 5 }]}>{progress.lessonsCompleted} of {course.totalLessons} lessons complete</Text>

            {/* Mini stats */}
            <View style={s.miniRow}>
              {[
                { v: `⚡ ${progress.xpEarned}`, l: 'XP Earned' },
                { v: `📖 ${progress.lessonsCompleted}`, l: 'Lessons' },
                { v: done ? '🏆 100%' : `🎯 ${pct}%`, l: done ? 'Mastered' : 'Progress' },
              ].map(item => (
                <View key={item.l} style={s.miniStat}>
                  <Text style={s.miniStatVal}>{item.v}</Text>
                  <Text style={s.miniStatLbl}>{item.l}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  summaryCard: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.md,
  },
  avatarBox: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.primaryMid,
  },
  xpBarBg: { height: 8, borderRadius: 99, backgroundColor: COLORS.primaryLight, overflow: 'hidden' },
  xpBarFill: { height: '100%', borderRadius: 99, backgroundColor: COLORS.primary },

  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  statItem: {
    flex: 1, alignItems: 'center',
    borderRightWidth: 1, borderRightColor: COLORS.border,
  },
  statVal: { fontSize: 20, fontWeight: '800' },
  statLbl: { fontSize: 11, color: COLORS.textMuted, marginTop: 3, fontWeight: '500' },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    ...SHADOWS.sm,
  },
  emojiBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },

  miniRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  miniStat: {
    flex: 1, alignItems: 'center', padding: 10,
    backgroundColor: COLORS.backgroundAlt, borderRadius: 10,
  },
  miniStatVal: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  miniStatLbl: { fontSize: 10, color: COLORS.textMuted, marginTop: 3, fontWeight: '500' },
});