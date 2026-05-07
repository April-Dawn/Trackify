import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import db from '../services/DatabaseService';
import { COLORS, globalStyles, SHADOWS } from '../styles/GlobalStyles';

export default function HomeScreen({ navigation }) {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    if (!user) return;
    const [s, courses, progress] = await Promise.all([
      db.getUserStats(user.id),
      db.getEnrolledCourses(user.id),
      db.getProgress(user.id, null),
    ]);
    setStats(s);
    setEnrolledCourses(courses);
    const map = {};
    progress.forEach(p => { map[p.courseId] = p; });
    setProgressMap(map);
    await refreshUser();
  };

  useFocusEffect(useCallback(() => { load(); }, [user?.id]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const level = Math.floor((user?.xp || 0) / 500) + 1;
  const xpInLevel = (user?.xp || 0) % 500;
  const xpPct = (xpInLevel / 500) * 100;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Hero Header */}
      <View style={s.hero}>
        <View style={s.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={s.greeting}>{greeting}</Text>
            <Text style={s.heroName} numberOfLines={1}>{user?.name}</Text>
          </View>
          <View style={s.avatarCircle}>
            <Text style={{ fontSize: 26 }}>{user?.avatar || '🎓'}</Text>
          </View>
        </View>

        {/* XP Card inside hero */}
        <View style={s.xpCard}>
          <View style={s.xpCardTop}>
            <View style={s.xpLevelBadge}>
              <Text style={s.xpLevelText}>Lv {level}</Text>
            </View>
            <Text style={s.xpCount}>{user?.xp || 0} XP</Text>
          </View>
          <View style={s.xpBarBg}>
            <View style={[s.xpBarFill, { width: `${xpPct}%` }]} />
          </View>
          <Text style={s.xpNext}>{xpInLevel} / 500 XP · {500 - xpInLevel} XP to Level {level + 1}</Text>
        </View>
      </View>

      {/* Stats Row */}
      {stats && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        >
          {[
            { emoji: '📚', label: 'Enrolled', value: stats.enrolledCourses, color: COLORS.primary, bg: COLORS.primaryLight },
            { emoji: '✓', label: 'Lessons', value: stats.totalLessons, color: COLORS.secondary, bg: COLORS.secondaryLight },
            { emoji: '🏆', label: 'Completed', value: stats.completedCourses, color: COLORS.accent, bg: COLORS.accentLight },
            { emoji: '⭐', label: 'Streak', value: stats.streak, color: COLORS.danger, bg: COLORS.dangerLight },
          ].map(item => (
            <View key={item.label} style={[s.statCard, { backgroundColor: item.bg }]}>
              <Text style={{ fontSize: 20, marginBottom: 6 }}>{item.emoji}</Text>
              <Text style={[s.statValue, { color: item.color }]}>{item.value}</Text>
              <Text style={s.statLabel}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Continue Learning */}
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Continue Learning</Text>
      </View>

      {enrolledCourses.length === 0 ? (
        <View style={globalStyles.emptyState}>
          <Text style={[globalStyles.h3, { marginTop: 14, marginBottom: 6 }]}>No courses yet</Text>
          <Text style={[globalStyles.body, { textAlign: 'center', paddingHorizontal: 40 }]}>
            Head to the Courses tab to explore and enroll!
          </Text>
        </View>
      ) : enrolledCourses.slice(0, 3).map(course => {
        const prog = progressMap[course.id] || { lessonsCompleted: 0 };
        const pct = Math.round((prog.lessonsCompleted / course.totalLessons) * 100);
        const done = prog.lessonsCompleted >= course.totalLessons;
        return (
          <TouchableOpacity
            key={course.id}
            style={s.courseCard}
            onPress={() => navigation.navigate('Courses')}
            activeOpacity={0.85}
          >
            <View style={[s.courseStripe, { backgroundColor: course.color }]} />
            <View style={s.courseBody}>
              <View style={[s.courseEmoji, { backgroundColor: course.color + '18' }]}>
                <Text style={{ fontSize: 24 }}>{course.emoji}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.courseTitle} numberOfLines={1}>{course.title}</Text>
                <Text style={s.courseSubject}>{course.subject}</Text>
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={globalStyles.caption}>{prog.lessonsCompleted} / {course.totalLessons} lessons</Text>
                    <Text style={[globalStyles.caption, { fontWeight: '700', color: done ? COLORS.secondary : course.color }]}>
                      {done ? '✓ Complete' : `${pct}%`}
                    </Text>
                  </View>
                  <View style={globalStyles.progressBar}>
                    <View style={[globalStyles.progressFill, { width: `${pct}%`, backgroundColor: done ? COLORS.secondary : course.color }]} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginBottom: 3 },
  heroName: { fontSize: 24, color: COLORS.white, fontWeight: '800', letterSpacing: -0.5 },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  xpCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  xpCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  xpLevelBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  xpLevelText: { color: COLORS.white, fontWeight: '800', fontSize: 13 },
  xpCount: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  xpBarBg: { height: 7, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  xpBarFill: { height: '100%', borderRadius: 99, backgroundColor: COLORS.white },
  xpNext: { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 6 },

  statCard: {
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 88,
    ...SHADOWS.sm,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, fontWeight: '500' },

  courseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  courseStripe: { width: 4 },
  courseBody: { flex: 1, flexDirection: 'row', padding: 14, alignItems: 'flex-start' },
  courseEmoji: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  courseTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.2 },
  courseSubject: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
});