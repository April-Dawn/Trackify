import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import { COLORS, globalStyles, SHADOWS } from '../styles/GlobalStyles';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(null);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) { setError('All fields are required'); return; }
    if (!email.includes('@')) { setError('Enter a valid email address'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    const result = await register(name.trim(), email.trim(), password);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={s.logoSection}>
          <View style={s.logoCircle}>
            <Text style={{ fontSize: 36 }}>🎓</Text>
          </View>
          <Text style={s.appName}>Trackify</Text>
          <Text style={s.tagline}>Start your learning journey today</Text>
        </View>

        {/* Card */}
        <View style={s.card}>
          <Text style={s.title}>Create account</Text>
          <Text style={s.subtitle}>Join thousands of learners</Text>

          {error ? (
            <View style={s.errorBox}>
              <Text style={s.errorText}>⚠️  {error}</Text>
            </View>
          ) : null}

          <Text style={s.label}>Full Name</Text>
          <TextInput
            style={[globalStyles.input, focused === 'name' && globalStyles.inputFocused]}
            placeholder="Your full name"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
          />

          <Text style={s.label}>Email address</Text>
          <TextInput
            style={[globalStyles.input, focused === 'email' && globalStyles.inputFocused]}
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
            style={[globalStyles.input, focused === 'pass' && globalStyles.inputFocused]}
            placeholder="Min. 6 characters"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setFocused('pass')}
            onBlur={() => setFocused(null)}
          />

          <TouchableOpacity
            style={[globalStyles.btn, globalStyles.btnPrimary, { marginTop: 6 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={globalStyles.btnText}>Create Account</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={s.link}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingTop: 64, paddingBottom: 40 },

  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primaryMid,
  },
  appName: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.6 },
  tagline: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    ...SHADOWS.md,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 22 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },

  errorBox: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: { color: COLORS.danger, fontSize: 13, fontWeight: '500' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28, alignItems: 'center' },
  footerText: { fontSize: 14, color: COLORS.textSecondary },
  link: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
});