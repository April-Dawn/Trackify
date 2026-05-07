import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import { COLORS, globalStyles, SHADOWS } from '../styles/GlobalStyles';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password'); return; }
    setLoading(true); setError('');
    const result = await login(email.trim(), password);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={s.logoSection}>
          <View style={s.logoCircle}>
            <Text style={{ fontSize: 38 }}>🎓</Text>
          </View>
          <Text style={s.appName}>Trackify</Text>
          <Text style={s.tagline}>Learn together. Grow together.</Text>
        </View>

        {/* Card */}
        <View style={s.card}>
          <Text style={s.title}>Welcome back</Text>
          <Text style={s.subtitle}>Sign in to continue learning</Text>

          {error ? (
            <View style={s.errorBox}>
              <Text style={s.errorText}>⚠️  {error}</Text>
            </View>
          ) : null}

          <Text style={s.label}>Email address</Text>
          <TextInput
            style={[globalStyles.input, focused === 'email' && globalStyles.inputFocused, { marginBottom: 8 }]}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
          />

          <Text style={s.label}>Password</Text>
          <TextInput
            style={[globalStyles.input, focused === 'pass' && globalStyles.inputFocused, { marginBottom: 8 }]}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setFocused('pass')}
            onBlur={() => setFocused(null)}
          />

          <TouchableOpacity
            style={[globalStyles.btn, globalStyles.btnPrimary, { marginTop: 6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={globalStyles.btnText}>Sign In</Text>
            }
          </TouchableOpacity>

          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or</Text>
            <View style={s.dividerLine} />
          </View>

          <TouchableOpacity
            style={s.demoBtn}
            onPress={() => { setEmail('demo@classroomify.com'); setPassword('demo1234'); setError(''); }}
          >
            <Text style={s.demoBtnText}>✨  Try Demo Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={s.link}>Sign up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingTop: 28, paddingBottom: 20 },

  logoSection: { alignItems: 'center', marginBottom: 18 },
  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primaryMid,
  },
  appName: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.8 },
  tagline: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    ...SHADOWS.md,
  },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4, marginBottom: 2 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 5 },

  errorBox: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: { color: COLORS.danger, fontSize: 13, fontWeight: '500' },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { marginHorizontal: 12, fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },

  demoBtn: {
    borderRadius: 12,
    padding: 11,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primaryMid,
  },
  demoBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, alignItems: 'center' },
  footerText: { fontSize: 14, color: COLORS.textSecondary },
  link: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
});