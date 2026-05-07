import { StyleSheet } from 'react-native';

export const COLORS = {
  // Core palette — deep navy + electric blue + warm white
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
  primaryMid: '#BFDBFE',

  secondary: '#10B981',
  secondaryLight: '#ECFDF5',

  accent: '#F59E0B',
  accentLight: '#FFFBEB',

  danger: '#EF4444',
  dangerLight: '#FEF2F2',

  purple: '#8B5CF6',
  purpleLight: '#F5F3FF',

  // Surfaces
  surface: '#FFFFFF',
  background: '#F8FAFC',
  backgroundAlt: '#F1F5F9',
  card: '#FFFFFF',

  // Borders
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  white: '#FFFFFF',

  // Nav
  navBg: '#FFFFFF',
  navBorder: '#E2E8F0',
};

export const COURSE_COLORS = [
  '#2563EB', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

export const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const globalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Cards
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    ...SHADOWS.sm,
  },
  cardElevated: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    ...SHADOWS.md,
  },

  // Layout
  row: { flexDirection: 'row', alignItems: 'center' },

  // Typography
  h1: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  h2: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.3 },
  h3: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  body: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  caption: { fontSize: 12, color: COLORS.textMuted, lineHeight: 16 },

  // Badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  // Inputs
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
    marginBottom: 12,
  },
  inputFocused: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },

  // Buttons
  btn: {
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnOutline: { borderWidth: 2, borderColor: COLORS.primary, backgroundColor: 'transparent' },
  btnText: { fontSize: 15, fontWeight: '800', color: COLORS.white, letterSpacing: 0.3 },
  btnTextOutline: { fontSize: 15, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.3 },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.white, letterSpacing: -0.4 },

  // Sections
  section: { marginTop: 24, marginBottom: 10, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 64 },

  // Progress
  progressBar: {
    height: 7,
    borderRadius: 99,
    backgroundColor: COLORS.backgroundAlt,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 99 },
});