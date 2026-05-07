import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../components/AuthProvider';
import db from '../services/DatabaseService';
import { COLORS, globalStyles, SHADOWS } from '../styles/GlobalStyles';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const RANK_COLOR = { 1: '#F59E0B', 2: '#94A3B8', 3: '#CD7F32' };
const TIERS = [
  { min: 2000, label: 'Diamond', emoji: '�', color: '#6366F1' },
  { min: 1500, label: 'Platinum', emoji: '✨', color: '#06B6D4' },
  { min: 1000, label: 'Gold',    emoji: '🏆', color: '#F59E0B' },
  { min: 500,  label: 'Silver',  emoji: '🥈', color: '#94A3B8' },
  { min: 0,    label: 'Bronze',  emoji: '🏅', color: '#CD7F32' },
];

const getTier = xp => TIERS.find(t => xp >= t.min) || TIERS[TIERS.length - 1];
const getLevel = xp => Math.floor(xp / 500) + 1;

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => { setBoard(await db.getLeaderboard()); };
  useFocusEffect(useCallback(() => { load(); }, [user?.id]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const myEntry = board.find(e => e.id === user?.id);
  const top3 = board.slice(0, 3);
  const rest = board.slice(3);

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Leaderboard</Text>
        <Text style={s.headerSub}>Top learners this season</Text>
      </View>

      {/* My Rank Banner */}
      {myEntry && (
        <View style={s.myRankCard}>
          <View style={s.myRankLeft}>
            <Text style={s.myRankLabel}>Your Rank</Text>
            <Text style={s.myRankNum}>#{myEntry.rank}</Text>
          </View>
          <View style={s.myRankDivider} />
          <View style={{ flex: 1, paddingLeft: 16 }}>
            <Text style={[globalStyles.caption, { marginBottom: 3 }]}>
              {getTier(myEntry.xp).emoji} {getTier(myEntry.xp).label} · Level {getLevel(myEntry.xp)}
            </Text>
            <Text style={[globalStyles.h3, { color: COLORS.primary }]}>{myEntry.xp} XP</Text>
          </View>
        </View>
      )}

      {/* Tier Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 14 }}
      >
        {TIERS.map(t => (
          <View key={t.label} style={[s.tierChip, { backgroundColor: t.color + '15', borderColor: t.color + '40' }]}>
            <Text style={{ fontSize: 14 }}>{t.emoji}</Text>
            <View style={{ marginLeft: 7 }}>
              <Text style={[s.tierLabel, { color: t.color }]}>{t.label}</Text>
              <Text style={s.tierXP}>{t.min.toLocaleString()}+ XP</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Podium */}
      {top3.length > 0 && (
        <>
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionTitle}>Podium</Text>
          </View>
          <View style={s.podium}>
            {[top3[1], top3[0], top3[2]].filter(Boolean).map((entry, i) => {
              const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
              const tier = getTier(entry.xp);
              const rankColor = RANK_COLOR[rank];
              return (
                <View key={entry.id} style={[s.podCard, { borderTopColor: rankColor }, rank === 1 && s.podCardFirst]}>
                  <Text style={{ fontSize: 22, marginBottom: 6 }}>{MEDAL[rank]}</Text>
                  <View style={[s.podAvatar, { backgroundColor: rankColor + '20' }]}>
                    <Text style={{ fontSize: 24 }}>{entry.avatar}</Text>
                  </View>
                  <Text style={[s.podName, entry.id === user?.id && { color: COLORS.primary }]} numberOfLines={1}>
                    {entry.name}
                  </Text>
                  <View style={[globalStyles.badge, { backgroundColor: tier.color + '18', alignSelf: 'center', marginVertical: 4 }]}>
                    <Text style={{ color: tier.color, fontSize: 10, fontWeight: '700' }}>{tier.emoji} {tier.label}</Text>
                  </View>
                  <Text style={[s.podXP, { color: rankColor }]}>{entry.xp} XP</Text>
                  <Text style={s.podSub}>Lv{getLevel(entry.xp)} · {entry.lessonsCompleted}L</Text>
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* Full Rankings */}
      {rest.length > 0 && (
        <>
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionTitle}>Full Rankings</Text>
          </View>
          <View style={s.listCard}>
            {rest.map((entry, idx) => {
              const isMe = entry.id === user?.id;
              const tier = getTier(entry.xp);
              return (
                <View key={entry.id}>
                  <View style={[s.row, isMe && s.rowMe]}>
                    <Text style={[s.rowRank, { color: RANK_COLOR[entry.rank] || COLORS.textMuted }]}>
                      {entry.rank <= 3 ? MEDAL[entry.rank] : `#${entry.rank}`}
                    </Text>
                    <View style={s.rowAvatar}>
                      <Text style={{ fontSize: 20 }}>{entry.avatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[s.rowName, isMe && { color: COLORS.primary }]} numberOfLines={1}>
                          {entry.name}
                        </Text>
                        {isMe && (
                          <View style={[globalStyles.badge, { backgroundColor: COLORS.primaryLight, marginLeft: 6 }]}>
                            <Text style={{ color: COLORS.primary, fontSize: 10, fontWeight: '700' }}>YOU</Text>
                          </View>
                        )}
                      </View>
                      <Text style={s.rowSub}>
                        Lv{getLevel(entry.xp)} · {tier.emoji} {tier.label} · {entry.coursesEnrolled} courses
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={s.rowXP}>{entry.xp} XP</Text>
                      <Text style={s.rowSub}>{entry.lessonsCompleted} lessons</Text>
                    </View>
                  </View>
                  {idx < rest.length - 1 && <View style={s.divider} />}
                </View>
              );
            })}
          </View>
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 54,
    paddingBottom: 22,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 3 },

  myRankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primaryMid,
    ...SHADOWS.sm,
  },
  myRankLeft: { paddingRight: 16 },
  myRankLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  myRankNum: { fontSize: 28, fontWeight: '800', color: COLORS.primary, letterSpacing: -0.5 },
  myRankDivider: { width: 1, height: '100%', backgroundColor: COLORS.border },

  tierChip: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8,
    marginRight: 8, borderWidth: 1.5,
  },
  tierLabel: { fontSize: 12, fontWeight: '700' },
  tierXP: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },

  podium: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 12, gap: 8, marginBottom: 8,
  },
  podCard: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: 16, padding: 12, alignItems: 'center',
    borderTopWidth: 4,
    ...SHADOWS.sm,
  },
  podCardFirst: { paddingVertical: 20, marginTop: -10, ...SHADOWS.md },
  podAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  podName: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 2 },
  podXP: { fontSize: 13, fontWeight: '800', marginTop: 4 },
  podSub: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },

  listCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  rowMe: { backgroundColor: COLORS.primaryLight },
  rowRank: { fontSize: 15, fontWeight: '800', minWidth: 36, textAlign: 'center' },
  rowAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  rowName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  rowSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  rowXP: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 72 },
});