import React, { useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet, Alert, ActivityIndicator, RefreshControl, Platform, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import db from '../services/DatabaseService';
import { COLORS, COURSE_COLORS, globalStyles, SHADOWS } from '../styles/GlobalStyles';

const SUBJECTS = ['Mobile Development', 'Web Development', 'Design', 'Computer Science', 'AI / ML', 'Data Science', 'Math', 'Other'];
const EMOJIS = ['📱', '💻', '🎨', '⚙️', '🔧', '📊', '📐', '🌐', '🔬', '📈'];

function LessonModal({ visible, course, progress, onClose, onComplete }) {
  if (!course) return null;
  const pct = Math.round(((progress?.lessonsCompleted || 0) / course.totalLessons) * 100);
  const done = (progress?.lessonsCompleted || 0) >= course.totalLessons;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        {/* Header */}
        <View style={[s.modalHeader, { backgroundColor: course.color }]}>
          <View style={s.modalHeaderInner}>
            <View style={s.modalEmoji}>
              <Text style={{ fontSize: 28 }}>{course.emoji}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.modalTitle} numberOfLines={1}>{course.title}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>{course.subject}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.modalClose}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, fontWeight: '600' }}>✕</Text>
            </TouchableOpacity>
          </View>
          {/* Progress inside header */}
          <View style={s.modalProgress}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' }}>
                {progress?.lessonsCompleted || 0} of {course.totalLessons} lessons
              </Text>
              <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: '800' }}>{pct}%</Text>
            </View>
            <View style={s.modalProgressBar}>
              <View style={[s.modalProgressFill, { width: `${pct}%` }]} />
            </View>
          </View>
        </View>

        <ScrollView style={{ padding: 20 }}>
          <Text style={[globalStyles.h3, { marginBottom: 16, color: COLORS.textMuted, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1.2, fontWeight: '800' }]}>
            Course Lessons
          </Text>
          {Array.from({ length: course.totalLessons }, (_, i) => {
            const completed = i < (progress?.lessonsCompleted || 0);
            const isCurrent = i === (progress?.lessonsCompleted || 0);
            return (
              <View key={i} style={[s.lessonRow, completed && s.lessonRowDone, isCurrent && { borderColor: course.color, borderWidth: 2 }]}>
                <View style={[s.lessonNum, {
                  backgroundColor: completed ? course.color : isCurrent ? course.color + '20' : COLORS.backgroundAlt,
                }]}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: completed ? '#fff' : isCurrent ? course.color : COLORS.textMuted }}>
                    {completed ? '✓' : i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[globalStyles.h3, { fontSize: 14, fontWeight: '700' }, !completed && !isCurrent && { color: COLORS.textMuted }]}>
                    {i === 0 ? 'Introduction' : i === course.totalLessons - 1 ? 'Final Project' : `Lesson ${i + 1}`}
                  </Text>
                  {completed && <Text style={[globalStyles.caption, { color: COLORS.secondary, marginTop: 3, fontWeight: '600' }]}>Completed · 50 XP</Text>}
                  {isCurrent && !done && <Text style={[globalStyles.caption, { color: course.color, marginTop: 3, fontWeight: '700' }]}>Up next</Text>}
                </View>
                {isCurrent && !done && (
                  <TouchableOpacity style={[s.markDoneBtn, { backgroundColor: course.color }]} onPress={onComplete}>
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.3 }}>Mark Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {done && (
            <View style={[s.completedBanner, { borderColor: course.color + '44', backgroundColor: course.color + '0C', borderWidth: 2 }]}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>✨</Text>
              <Text style={[globalStyles.h2, { color: course.color, marginBottom: 8, fontWeight: '900', letterSpacing: -0.5 }]}>Course Complete!</Text>
              <Text style={[globalStyles.body, { color: COLORS.textSecondary, textAlign: 'center' }]}>You've mastered all {course.totalLessons} lessons</Text>
            </View>
          )}
          <View style={{ height: 48 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

function AddCourseModal({ visible, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [instructor, setInstructor] = useState('');
  const [lessons, setLessons] = useState('8');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState(COURSE_COLORS[0]);
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim() || !instructor.trim()) {
      Alert.alert('Required', 'Title and instructor are required.');
      return;
    }
    setLoading(true);
    await onAdd({ title: title.trim(), subject, instructor: instructor.trim(), description: desc.trim(), totalLessons: parseInt(lessons) || 8, color, emoji });
    setLoading(false);
    setTitle(''); setInstructor(''); setDesc(''); setLessons('8');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={s.addHeader}>
          <Text style={globalStyles.h2}>New Course</Text>
          <TouchableOpacity onPress={onClose} style={s.addCloseBtn}>
            <Text style={{ color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' }}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <Text style={s.label}>Pick an Emoji</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {EMOJIS.map(e => (
              <TouchableOpacity key={e} onPress={() => setEmoji(e)} style={[s.emojiPick, emoji === e && { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary }]}>
                <Text style={{ fontSize: 22 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.label}>Color</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            {COURSE_COLORS.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[s.colorDot, { backgroundColor: c }, color === c && { borderWidth: 3, borderColor: COLORS.textPrimary }]}
              />
            ))}
          </View>

          <Text style={s.label}>Title *</Text>
          <TextInput style={globalStyles.input} placeholder="e.g. Introduction to React Native" placeholderTextColor={COLORS.textMuted} value={title} onChangeText={setTitle} />

          <Text style={s.label}>Instructor *</Text>
          <TextInput style={globalStyles.input} placeholder="e.g. Prof. Smith" placeholderTextColor={COLORS.textMuted} value={instructor} onChangeText={setInstructor} />

          <Text style={s.label}>Subject</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {SUBJECTS.map(sub => (
              <TouchableOpacity key={sub} onPress={() => setSubject(sub)} style={[s.chip, subject === sub && s.chipSel]}>
                <Text style={[s.chipText, subject === sub && { color: COLORS.primary, fontWeight: '700' }]}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.label}>Total Lessons</Text>
          <TextInput style={globalStyles.input} placeholder="8" placeholderTextColor={COLORS.textMuted} value={lessons} onChangeText={setLessons} keyboardType="numeric" />

          <Text style={s.label}>Description</Text>
          <TextInput
            style={[globalStyles.input, { height: 90, textAlignVertical: 'top' }]}
            placeholder="What will students learn?"
            placeholderTextColor={COLORS.textMuted}
            value={desc}
            onChangeText={setDesc}
            multiline
          />

          <TouchableOpacity style={[globalStyles.btn, globalStyles.btnPrimary]} onPress={handleAdd} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.btnText}>Create Course</Text>}
          </TouchableOpacity>
          <View style={{ height: 48 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function CoursesScreen() {
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showLesson, setShowLesson] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const cardAnimations = useRef({});

  const load = async () => {
    const [all, enrolled, progress] = await Promise.all([
      db.getCourses(),
      db.getEnrolledCourses(user.id),
      db.getProgress(user.id, null),
    ]);
    setCourses(all);
    setEnrolledIds(enrolled.map(c => c.id));
    const map = {};
    progress.forEach(p => { map[p.courseId] = p; });
    setProgressMap(map);
  };

  useFocusEffect(useCallback(() => { load(); }, [user?.id]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const handleEnroll = async (courseId) => {
    const r = await db.enrollInCourse(user.id, courseId);
    if (r.success) { await load(); Alert.alert('Enrolled', 'Start learning now!'); }
    else Alert.alert('Oops', r.error);
  };

  const handleComplete = async () => {
    const r = await db.completeLesson(user.id, selectedCourse.id);
    if (r.success) {
      await Promise.all([load(), refreshUser()]);
      const np = await db.getProgress(user.id, selectedCourse.id);
      const isFinished = np?.lessonsCompleted >= selectedCourse.totalLessons;
      Alert.alert(isFinished ? 'Course Complete!' : '+50 XP!', isFinished ? 'You mastered this course!' : 'Lesson done. Keep it up!');
    } else Alert.alert('Info', r.error || 'Could not complete lesson');
  };

  const handleDelete = (course) => {
    const doDelete = async () => {
      await db.deleteCourse(course.id);
      if (selectedCourse?.id === course.id) { setShowLesson(false); setSelectedCourse(null); }
      await load();
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`Remove "${course.title}"?`)) doDelete();
    } else {
      Alert.alert('Delete Course', `Remove "${course.title}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const displayed = tab === 'enrolled' ? courses.filter(c => enrolledIds.includes(c.id)) : courses;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View style={globalStyles.header}>
        <View>
          <Text style={globalStyles.headerTitle}>Courses</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4, fontWeight: '500' }}>Expand your knowledge</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAdd(true)} style={s.addBtn}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '300', marginBottom: 2 }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {['all', 'enrolled'].map(t => (
          <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>
              {t === 'all' ? 'All Courses' : 'My Courses'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 }}
      >
        {displayed.length === 0 ? (
          <View style={globalStyles.emptyState}>
            <Text style={[globalStyles.h3, { marginBottom: 8 }]}>
              {tab === 'enrolled' ? 'Not enrolled yet' : 'No courses yet'}
            </Text>
            <Text style={[globalStyles.body, { textAlign: 'center' }]}>
              {tab === 'enrolled' ? 'Browse All Courses to get started!' : 'Tap + to add a course!'}
            </Text>
          </View>
        ) : displayed.map(course => {
          const enrolled = enrolledIds.includes(course.id);
          const prog = progressMap[course.id];
          const pct = prog ? Math.round((prog.lessonsCompleted / course.totalLessons) * 100) : 0;
          const done = prog && prog.lessonsCompleted >= course.totalLessons;

          return (
            <View key={course.id} style={s.courseCard}>
              {/* Banner */}
              <View style={[s.cardBanner, { backgroundColor: course.color }]}>
                <View style={s.cardBannerContent}>
                  <View style={s.cardEmojiBox}>
                    <Text style={{ fontSize: 28 }}>{course.emoji}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={s.cardTitle} numberOfLines={2}>{course.title}</Text>
                    <Text style={s.cardSubject}>{course.subject}</Text>
                  </View>
                </View>
                <TouchableOpacity style={s.deleteIcon} onPress={() => handleDelete(course)}>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>✕</Text>
                </TouchableOpacity>
                {done && (
                  <View style={s.completedTag}>
                    <Text style={{ color: COLORS.secondary, fontSize: 10, fontWeight: '800' }}>✓ COMPLETED</Text>
                  </View>
                )}
              </View>

              {/* Body */}
              <View style={s.cardBody}>
                <View style={s.cardMeta}>
                  <Text style={[globalStyles.body, { fontWeight: '600', color: COLORS.textPrimary }]}>
                    {course.instructor}
                  </Text>
                  <Text style={[globalStyles.caption, { marginTop: 4, color: COLORS.textMuted, fontWeight: '500' }]}>
                    {course.totalLessons} lessons • 50 XP per lesson
                  </Text>
                </View>

                {course.description ? (
                  <Text style={[globalStyles.caption, { marginBottom: 14, lineHeight: 18, color: COLORS.textSecondary }]} numberOfLines={2}>
                    {course.description}
                  </Text>
                ) : null}

                {enrolled ? (
                  <>
                    <View style={s.progressContainer}>
                      <View style={s.progressLabel}>
                        <Text style={[globalStyles.caption, { fontWeight: '700', color: COLORS.textSecondary }]}>Progress</Text>
                        <Text style={[globalStyles.caption, { fontWeight: '800', color: done ? COLORS.secondary : course.color }]}>
                          {done ? '✓ Complete' : `${pct}%`}
                        </Text>
                      </View>
                      <View style={s.progressBar}>
                        <View style={[s.progressFill, { width: `${pct}%`, backgroundColor: done ? COLORS.secondary : course.color }]} />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[s.actionBtn, { backgroundColor: done ? COLORS.secondary : course.color }]}
                      onPress={() => { setSelectedCourse(course); setShowLesson(true); }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.3 }}>
                        {done ? 'Review Course' : 'Continue Learning'}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={[s.actionBtn, { backgroundColor: course.color }]} onPress={() => handleEnroll(course.id)}>
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.3 }}>
                      Enroll Now
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
        <View style={{ height: 80 }} />
      </ScrollView>

      <LessonModal
        visible={showLesson}
        course={selectedCourse}
        progress={selectedCourse ? progressMap[selectedCourse.id] : null}
        onClose={() => setShowLesson(false)}
        onComplete={handleComplete}
      />
      <AddCourseModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={async (d) => { await db.addCourse(d); await load(); }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.border,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
  tabTextActive: { color: COLORS.primary, fontWeight: '800', letterSpacing: 0.3 },

  // Course Card
  courseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  cardBanner: { padding: 18, minHeight: 100, justifyContent: 'space-between' },
  cardBannerContent: { flexDirection: 'row', alignItems: 'center' },
  cardEmojiBox: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: -0.3, marginBottom: 4 },
  cardSubject: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  deleteIcon: { position: 'absolute', top: 12, right: 12, padding: 8, opacity: 0.7 },
  completedTag: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  cardBody: { padding: 16 },
  cardMeta: { marginBottom: 12 },
  actionBtn: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },

  // Progress Bar - Professional
  progressContainer: { marginVertical: 12 },
  progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressBar: { height: 8, borderRadius: 99, backgroundColor: COLORS.backgroundAlt, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },

  // Lesson Modal
  modalHeader: { paddingTop: 52, paddingBottom: 18, paddingHorizontal: 20 },
  modalHeaderInner: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  modalEmoji: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: { color: '#fff', fontWeight: '900', fontSize: 17, letterSpacing: -0.3 },
  modalClose: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  modalProgress: { marginTop: 6 },
  modalProgressBar: { height: 7, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.35)', overflow: 'hidden' },
  modalProgressFill: { height: '100%', borderRadius: 99, backgroundColor: '#fff' },
  lessonRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1.5, borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  lessonRowDone: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primaryMid },
  lessonNum: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
  markDoneBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 },
  completedBanner: {
    borderRadius: 16, padding: 24, alignItems: 'center',
    borderWidth: 2, marginTop: 16,
  },

  // Add Modal
  addHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 52,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1.5, borderBottomColor: COLORS.border,
  },
  addCloseBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 10, letterSpacing: 0.3, textTransform: 'uppercase' },
  emojiPick: {
    width: 50, height: 50, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10, backgroundColor: COLORS.backgroundAlt,
    borderWidth: 2, borderColor: COLORS.border,
  },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 99,
    backgroundColor: COLORS.backgroundAlt, marginRight: 10,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  chipSel: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary, borderWidth: 2 },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
});